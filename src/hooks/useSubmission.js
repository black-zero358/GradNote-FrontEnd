import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { processImage, processAnswerImage } from '../api/image.service';
import { createQuestion, updateQuestion } from '../api/question.service';
import {
  analyzeKnowledgeFromQuestion,
  searchKnowledgePoints,
  extractKnowledgeFromSolution
} from '../api/knowledge.service';
import { solveQuestion } from '../api/solving.service';
import useSubmissionStore, { REVIEW_STATUS } from '../stores/submissionStore';
import { STEP_STATUS } from '../components/common/StepIndicator';

/**
 * 错题提交流程Hook
 * 处理错题提交的各个步骤
 */
const useSubmission = () => {
  const queryClient = useQueryClient();
  const [stepDetailsVisible, setStepDetailsVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

  // 从store获取方法
  const {
    addSubmission,
    updateSubmissionStep,
    setQuestionId,
    getSubmission,
    updateOcrText,
    updateAnswerText,
    updateReviewStatus
  } = useSubmissionStore();

  // OCR处理mutation
  const ocrMutation = useMutation({
    mutationFn: ({ file, submissionId }) => {
      // 返回一个包含文件和提交ID的Promise
      return processImage(file).then(data => ({ data, submissionId }));
    },
    onMutate: (variables) => {
      // 更新步骤状态为处理中
      updateSubmissionStep(variables.submissionId, 'ocr', STEP_STATUS.PROCESSING);
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 更新步骤状态为成功
      updateSubmissionStep(submissionId, 'ocr', STEP_STATUS.SUCCESS, data);

      // 自动创建错题记录
      const submission = getSubmission(submissionId);
      if (submission) {
        createQuestionMutation.mutate({
          content: data.text,
          image_url: data.image_url,
          submissionId: submissionId // 传递submissionId
        });
      }
    },
    onError: (error, variables) => {
      // 更新步骤状态为失败
      updateSubmissionStep(variables.submissionId, 'ocr', STEP_STATUS.FAILED, null, error);
      message.error('OCR处理失败: ' + (error.message || '未知错误'));
    }
  });

  // 创建错题mutation
  const createQuestionMutation = useMutation({
    mutationFn: ({ content, image_url, submissionId, ...rest }) => {
      // 将submissionId从请求参数中分离出来
      return createQuestion({ content, image_url, ...rest }).then(data => ({ data, submissionId }));
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 保存问题ID
      setQuestionId(submissionId, data.id);
      message.success('错题创建成功');

      // 自动进行下一步 - 答案识别
      const submission = getSubmission(submissionId);
      if (submission && submission.imageFile) {
        answerMutation.mutate({
          file: submission.imageFile,
          submissionId: submissionId
        });
      }
    },
    onError: (error, variables) => {
      message.error('创建错题失败: ' + (error.message || '未知错误'));
    }
  });

  // 答案处理mutation
  const answerMutation = useMutation({
    mutationFn: ({ file, submissionId }) => {
      return processAnswerImage(file).then(data => ({ data, submissionId }));
    },
    onMutate: (variables) => {
      // 更新步骤状态为处理中
      updateSubmissionStep(variables.submissionId, 'answer', STEP_STATUS.PROCESSING);
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 更新步骤状态为成功
      updateSubmissionStep(submissionId, 'answer', STEP_STATUS.SUCCESS, data);

      // 如果有答案，更新错题
      const submission = getSubmission(submissionId);
      if (submission && submission.questionId && data.text) {
        updateQuestionMutation.mutate({
          id: submission.questionId,
          data: { answer: data.text },
          submissionId: submissionId
        });
      }

      // 自动进行下一步 - 知识点检索
      const ocrData = submission?.data?.ocr;
      if (ocrData && ocrData.text) {
        knowledgeAnalyzeMutation.mutate({
          questionText: ocrData.text,
          submissionId: submissionId
        });
      }
    },
    onError: (error, variables) => {
      // 更新步骤状态为失败
      updateSubmissionStep(variables.submissionId, 'answer', STEP_STATUS.FAILED, null, error);
      message.error('答案处理失败: ' + (error.message || '未知错误'));
    }
  });

  // 更新错题mutation
  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data, submissionId }) => {
      return updateQuestion(id, data).then(result => ({ result, submissionId }));
    },
    onSuccess: (result, variables) => {
      message.success('错题更新成功');
    },
    onError: (error, variables) => {
      message.error('更新错题失败: ' + (error.message || '未知错误'));
    }
  });

  // 知识点分析mutation
  const knowledgeAnalyzeMutation = useMutation({
    mutationFn: ({ questionText, submissionId }) => {
      return analyzeKnowledgeFromQuestion(questionText).then(data => ({ data, submissionId }));
    },
    onMutate: (variables) => {
      // 更新步骤状态为处理中
      updateSubmissionStep(variables.submissionId, 'knowledge', STEP_STATUS.PROCESSING);
      // 提示用户这个操作可能需要较长时间
      message.info('正在分析题目知识点，这可能需要一到两分钟的时间...');
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 更新步骤状态为成功
      updateSubmissionStep(submissionId, 'knowledge', STEP_STATUS.SUCCESS, data);

      // 自动进行下一步 - 解题
      const submission = getSubmission(submissionId);
      if (submission && submission.questionId && data.categories && data.categories.length > 0) {
        // 处理所有类别的知识点
        processAllCategories(data.categories, submissionId, submission.questionId);
      }
    },
    onError: (error, variables) => {
      // 更新步骤状态为失败
      updateSubmissionStep(variables.submissionId, 'knowledge', STEP_STATUS.FAILED, null, error);
      message.error('知识点分析失败: ' + (error.message || '未知错误'));
    }
  });

  // 处理所有知识点类别
  const processAllCategories = async (categories, submissionId, questionId) => {
    try {
      // 更新步骤状态为处理中
      updateSubmissionStep(submissionId, 'knowledge', STEP_STATUS.PROCESSING, null, null);
      message.info('正在搜索所有相关知识点，这可能需要一些时间...');

      // 存储所有知识点ID
      let allKnowledgePointIds = [];

      // 为每个类别搜索知识点
      for (const category of categories) {
        try {
          const searchResult = await searchKnowledgePoints({
            subject: category.subject,
            chapter: category.chapter,
            section: category.section
          });

          // 收集知识点ID
          const categoryKnowledgePointIds = searchResult.map(point => point.id);
          allKnowledgePointIds = [...allKnowledgePointIds, ...categoryKnowledgePointIds];
        } catch (error) {
          console.error(`搜索知识点失败 (${category.subject} > ${category.chapter} > ${category.section}):`, error);
        }
      }

      // 去重
      allKnowledgePointIds = [...new Set(allKnowledgePointIds)];

      // 保存所有搜索到的知识点ID到submission中
      updateSubmissionStep(submissionId, 'knowledge', STEP_STATUS.SUCCESS, {
        categories,
        allKnowledgePointIds
      });

      // 如果找到了知识点，进行解题
      if (allKnowledgePointIds.length > 0) {
        solveMutation.mutate({
          questionId: questionId,
          knowledgePoints: allKnowledgePointIds,
          submissionId: submissionId
        });
      } else {
        // 如果没有知识点，标记解题步骤为失败
        updateSubmissionStep(submissionId, 'solving', STEP_STATUS.FAILED, null, {
          message: '未找到相关知识点，无法解题'
        });
      }
    } catch (error) {
      // 更新步骤状态为失败
      updateSubmissionStep(submissionId, 'knowledge', STEP_STATUS.FAILED, null, error);
      message.error('处理知识点类别失败: ' + (error.message || '未知错误'));
    }
  };

  // 搜索知识点mutation - 用于单个类别的搜索（主要用于重试功能）
  const searchKnowledgePointsMutation = useMutation({
    mutationFn: ({ subject, chapter, section, submissionId, categories }) => {
      // 如果提供了categories数组，则处理所有类别
      if (categories && Array.isArray(categories) && categories.length > 0) {
        return Promise.resolve({ categories, submissionId });
      }
      // 否则只处理单个类别
      return searchKnowledgePoints({ subject, chapter, section })
        .then(data => ({ data, submissionId, singleCategory: true }));
    },
    onSuccess: (result) => {
      const { data, submissionId, singleCategory, categories } = result;

      // 如果是处理所有类别
      if (!singleCategory && categories) {
        const submission = getSubmission(submissionId);
        if (submission && submission.questionId) {
          processAllCategories(categories, submissionId, submission.questionId);
        }
        return;
      }

      // 单个类别的处理逻辑
      // 获取知识点ID列表
      const knowledgePointIds = data.map(point => point.id);

      // 自动进行下一步 - 解题
      const submission = getSubmission(submissionId);
      if (submission && submission.questionId && knowledgePointIds.length > 0) {
        solveMutation.mutate({
          questionId: submission.questionId,
          knowledgePoints: knowledgePointIds,
          submissionId: submissionId
        });
      } else {
        // 如果没有知识点，标记解题步骤为失败
        updateSubmissionStep(submissionId, 'solving', STEP_STATUS.FAILED, null, {
          message: '未找到相关知识点，无法解题'
        });
      }
    },
    onError: (error, variables) => {
      message.error('搜索知识点失败: ' + (error.message || '未知错误'));
    }
  });

  // 解题mutation
  const solveMutation = useMutation({
    mutationFn: ({ questionId, knowledgePoints, submissionId }) =>
      solveQuestion(questionId, { knowledge_points: knowledgePoints })
        .then(data => ({ data, submissionId })),
    onMutate: (variables) => {
      // 更新步骤状态为处理中
      updateSubmissionStep(variables.submissionId, 'solving', STEP_STATUS.PROCESSING);
      // 提示用户这个操作可能需要较长时间
      message.info('正在解题，这可能需要一到两分钟的时间...');
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 更新步骤状态为成功
      updateSubmissionStep(submissionId, 'solving', STEP_STATUS.SUCCESS, data);

      // 自动进行下一步 - 提取知识点
      const submission = getSubmission(submissionId);
      if (submission) {
        const ocrData = submission?.data?.ocr;
        const solutionData = data?.data?.solution;

        if (ocrData && ocrData.text && solutionData) {
          // 获取知识点ID列表，优先从solving.data.knowledge_points获取
          let knowledgePointIds = [];

          // 从solving.data.knowledge_points获取ID
          if (data?.data?.knowledge_points && Array.isArray(data.data.knowledge_points)) {
            knowledgePointIds = data.data.knowledge_points
              .filter(point => point && point.id !== undefined && point.id !== null)
              .map(point => Number(point.id));
          }

          // 如果没有从solving.data获取到，则尝试从knowledge.allKnowledgePointIds 获取
          if (knowledgePointIds.length === 0) {
            // 首先尝试从 allKnowledgePointIds 获取（新增的字段）
            if (submission.data?.knowledge?.allKnowledgePointIds &&
                Array.isArray(submission.data.knowledge.allKnowledgePointIds) &&
                submission.data.knowledge.allKnowledgePointIds.length > 0) {
              knowledgePointIds = submission.data.knowledge.allKnowledgePointIds
                .filter(id => id !== undefined && id !== null)
                .map(id => Number(id));
            }
            // 如果还是没有，则尝试从categories获取
            else if (submission.data?.knowledge?.categories) {
              knowledgePointIds = submission.data.knowledge.categories
                ?.filter(c => c && c.id !== undefined && c.id !== null)
                ?.map(c => Number(c.id)) || [];
            }
          }

          extractKnowledgeMutation.mutate({
            question_text: ocrData.text,
            solution_text: solutionData,
            // 只有当有有效的知识点ID时才传递该参数
            ...(knowledgePointIds.length > 0 ? { existing_knowledge_point_ids: knowledgePointIds } : {}),
            submissionId: submissionId
          });
        }
      }
    },
    onError: (error, variables) => {
      // 更新步骤状态为失败
      updateSubmissionStep(variables.submissionId, 'solving', STEP_STATUS.FAILED, null, error);
      message.error('解题失败: ' + (error.message || '未知错误'));
    }
  });

  // 提取知识点mutation
  const extractKnowledgeMutation = useMutation({
    mutationFn: ({ question_text, solution_text, existing_knowledge_point_ids, submissionId }) => {
      return extractKnowledgeFromSolution({
        question_text,
        solution_text,
        existing_knowledge_point_ids
      }).then(data => ({ data, submissionId }));
    },
    onMutate: (variables) => {
      // 更新步骤状态为处理中
      updateSubmissionStep(variables.submissionId, 'knowledgeMarks', STEP_STATUS.PROCESSING);
      // 提示用户这个操作可能需要较长时间
      message.info('正在提取知识点，这可能需要一到两分钟的时间...');
    },
    onSuccess: (result) => {
      const { data, submissionId } = result;
      // 更新步骤状态为成功
      updateSubmissionStep(submissionId, 'knowledgeMarks', STEP_STATUS.SUCCESS, data);

      // 设置审核状态为待审核
      updateReviewStatus(submissionId, REVIEW_STATUS.PENDING_REVIEW);

      message.success('错题提交流程完成');
    },
    onError: (error, variables) => {
      // 更新步骤状态为失败
      updateSubmissionStep(
        variables.submissionId,
        'knowledgeMarks',
        STEP_STATUS.FAILED,
        null,
        error
      );
      message.error('提取知识点失败: ' + (error.message || '未知错误'));
    }
  });

  // 处理图片上传
  const handleImageUpload = useCallback(async (file) => {
    // 创建新的提交实例
    const submissionId = addSubmission(file);
    setCurrentSubmissionId(submissionId);

    // 开始OCR处理
    ocrMutation.mutate({ file, submissionId });

    return submissionId;
  }, [addSubmission, ocrMutation]);

  // 处理步骤点击
  const handleStepClick = useCallback((stepName, submissionId) => {
    setCurrentStep(stepName);
    setCurrentSubmissionId(submissionId);
    setStepDetailsVisible(true);
  }, []);

  // 处理详情按钮点击
  const handleDetailsClick = useCallback((submissionId) => {
    setCurrentSubmissionId(submissionId);
    setDetailsVisible(true);
  }, []);

  // 关闭步骤详情弹窗
  const closeStepDetails = useCallback(() => {
    setStepDetailsVisible(false);
  }, []);

  // 关闭详情弹窗
  const closeDetails = useCallback(() => {
    setDetailsVisible(false);
  }, []);

  // 处理编辑
  const handleEdit = useCallback((stepName, value) => {
    const submission = getSubmission(currentSubmissionId);
    if (!submission || !submission.questionId) return;

    if (stepName === 'ocr') {
      // 更新OCR文本
      updateOcrText(currentSubmissionId, value);

      // 更新错题内容
      updateQuestionMutation.mutate({
        id: submission.questionId,
        data: { content: value },
        submissionId: currentSubmissionId
      });

      // 重置后续步骤
      updateSubmissionStep(currentSubmissionId, 'knowledge', STEP_STATUS.PENDING);
      updateSubmissionStep(currentSubmissionId, 'solving', STEP_STATUS.PENDING);
      updateSubmissionStep(currentSubmissionId, 'knowledgeMarks', STEP_STATUS.PENDING);

      // 重新分析知识点
      knowledgeAnalyzeMutation.mutate({
        questionText: value,
        submissionId: currentSubmissionId
      });
    } else if (stepName === 'answer') {
      // 更新答案文本
      updateAnswerText(currentSubmissionId, value);

      // 更新错题答案
      updateQuestionMutation.mutate({
        id: submission.questionId,
        data: { answer: value },
        submissionId: currentSubmissionId
      });
    }

    message.success('编辑成功');
  }, [
    currentSubmissionId,
    getSubmission,
    updateOcrText,
    updateAnswerText,
    updateQuestionMutation,
    knowledgeAnalyzeMutation
  ]);

  // 处理重试
  const handleRetry = useCallback((stepName) => {
    const submission = getSubmission(currentSubmissionId);
    if (!submission) return;

    switch (stepName) {
      case 'ocr':
        if (submission.imageFile) {
          ocrMutation.mutate({
            file: submission.imageFile,
            submissionId: currentSubmissionId
          });
        }
        break;

      case 'answer':
        if (submission.imageFile) {
          answerMutation.mutate({
            file: submission.imageFile,
            submissionId: currentSubmissionId
          });
        }
        break;

      case 'knowledge':
        const ocrData = submission?.data?.ocr;
        if (ocrData && ocrData.text) {
          knowledgeAnalyzeMutation.mutate({
            questionText: ocrData.text,
            submissionId: currentSubmissionId
          });
        }
        break;

      case 'solving':
        const knowledgeData = submission?.data?.knowledge;
        if (submission.questionId && knowledgeData && knowledgeData.categories) {
          // 处理所有类别
          searchKnowledgePointsMutation.mutate({
            categories: knowledgeData.categories,
            submissionId: currentSubmissionId
          });
        }
        break;

      case 'knowledgeMarks':
        const ocrText = submission?.data?.ocr?.text;
        const solutionData = submission?.data?.solving?.data?.solution;

        if (ocrText && solutionData) {
          // 获取知识点ID列表，优先从solving.data.knowledge_points获取
          let knowledgePointIds = [];

          // 从solving.data.knowledge_points获取ID
          if (submission?.data?.solving?.data?.knowledge_points &&
              Array.isArray(submission.data.solving.data.knowledge_points)) {
            knowledgePointIds = submission.data.solving.data.knowledge_points
              .filter(point => point && point.id !== undefined && point.id !== null)
              .map(point => Number(point.id));
          }

          // 如果没有从solving.data获取到，则尝试从knowledge.allKnowledgePointIds 获取
          if (knowledgePointIds.length === 0) {
            // 首先尝试从 allKnowledgePointIds 获取（新增的字段）
            if (submission.data?.knowledge?.allKnowledgePointIds &&
                Array.isArray(submission.data.knowledge.allKnowledgePointIds) &&
                submission.data.knowledge.allKnowledgePointIds.length > 0) {
              knowledgePointIds = submission.data.knowledge.allKnowledgePointIds
                .filter(id => id !== undefined && id !== null)
                .map(id => Number(id));
            }
            // 如果还是没有，则尝试从categories获取
            else if (submission.data?.knowledge?.categories) {
              knowledgePointIds = submission.data.knowledge.categories
                .filter(point => point && point.id !== undefined && point.id !== null)
                .map(point => Number(point.id)) || [];
            }
          }

          extractKnowledgeMutation.mutate({
            question_text: ocrText,
            solution_text: solutionData,
            // 只有当有有效的知识点ID时才传递该参数
            ...(knowledgePointIds.length > 0 ? { existing_knowledge_point_ids: knowledgePointIds } : {}),
            submissionId: currentSubmissionId
          });
        }
        break;

      default:
        break;
    }
  }, [
    currentSubmissionId,
    getSubmission,
    ocrMutation,
    answerMutation,
    knowledgeAnalyzeMutation,
    searchKnowledgePointsMutation,
    extractKnowledgeMutation
  ]);

  return {
    // 状态
    stepDetailsVisible,
    detailsVisible,
    currentStep,
    currentSubmissionId,

    // 方法
    handleImageUpload,
    handleStepClick,
    handleDetailsClick,
    closeStepDetails,
    closeDetails,
    handleEdit,
    handleRetry,

    // Mutations
    ocrMutation,
    createQuestionMutation,
    answerMutation,
    updateQuestionMutation,
    knowledgeAnalyzeMutation,
    searchKnowledgePointsMutation,
    solveMutation,
    extractKnowledgeMutation
  };
};

export default useSubmission;
