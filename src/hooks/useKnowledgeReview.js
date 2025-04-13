import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import useSubmissionStore, { REVIEW_STATUS } from '../stores/submissionStore';
import { markConfirmedKnowledgePoints } from '../api/knowledge.service';

/**
 * 知识点审核页面的自定义Hook
 * 处理知识点审核相关的状态和逻辑
 */
const useKnowledgeReview = () => {
  // 从store获取提交列表
  const { submissions, getSubmission, updateReviewStatus, updateSubmissionStep } = useSubmissionStore();

  // 本地状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionsWithKnowledge, setSubmissionsWithKnowledge] = useState([]);

  // 已确认和已拒绝的知识点ID映射
  const [confirmedKnowledgePoints, setConfirmedKnowledgePoints] = useState({});
  const [rejectedKnowledgePoints, setRejectedKnowledgePoints] = useState({});

  // 从localStorage加载已确认和已拒绝的知识点
  useEffect(() => {
    try {
      const storageKey = 'gradnote-knowledge-review-state';
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState.confirmedKnowledgePoints) {
          setConfirmedKnowledgePoints(parsedState.confirmedKnowledgePoints);
        }
        if (parsedState.rejectedKnowledgePoints) {
          setRejectedKnowledgePoints(parsedState.rejectedKnowledgePoints);
        }
      }
    } catch (error) {
      console.error('从 localStorage 加载知识点审核状态失败', error);
    }
  }, []);

  // 初始化时过滤出包含知识点的提交
  useEffect(() => {
    const filteredSubmissions = submissions.filter(submission => {
      // 检查是否有knowledgeMarks数据且已完成解题流程
      return (
        submission.data &&
        submission.data.knowledgeMarks &&
        (
          (submission.data.knowledgeMarks.existing_knowledge_points &&
           submission.data.knowledgeMarks.existing_knowledge_points.length > 0) ||
          (submission.data.knowledgeMarks.new_knowledge_points &&
           submission.data.knowledgeMarks.new_knowledge_points.length > 0)
        ) &&
        // 只包含待审核或正在审核或已审核的提交
        (submission.reviewStatus === REVIEW_STATUS.PENDING_REVIEW ||
         submission.reviewStatus === REVIEW_STATUS.REVIEWING ||
         submission.reviewStatus === REVIEW_STATUS.REVIEWED)
      );
    });

    setSubmissionsWithKnowledge(filteredSubmissions);
  }, [submissions]);

  // 保存知识点审核状态到localStorage
  const saveReviewStateToLocalStorage = useCallback((confirmed, rejected) => {
    try {
      const storageKey = 'gradnote-knowledge-review-state';
      localStorage.setItem(storageKey, JSON.stringify({
        confirmedKnowledgePoints: confirmed,
        rejectedKnowledgePoints: rejected
      }));
    } catch (error) {
      console.error('保存知识点审核状态到 localStorage 失败', error);
    }
  }, []);

  // 确认知识点
  const confirmKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setConfirmedKnowledgePoints(prev => {
      const newState = {
        ...prev,
        [`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`]: true
      };
      // 保存到localStorage
      saveReviewStateToLocalStorage(newState, rejectedKnowledgePoints);
      return newState;
    });

    // 如果之前被拒绝，则移除拒绝状态
    setRejectedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      // 保存到localStorage
      saveReviewStateToLocalStorage(confirmedKnowledgePoints, newState);
      return newState;
    });
  }, [confirmedKnowledgePoints, rejectedKnowledgePoints, saveReviewStateToLocalStorage]);

  // 拒绝知识点
  const rejectKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setRejectedKnowledgePoints(prev => {
      const newState = {
        ...prev,
        [`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`]: true
      };
      // 保存到localStorage
      saveReviewStateToLocalStorage(confirmedKnowledgePoints, newState);
      return newState;
    });

    // 如果之前被确认，则移除确认状态
    setConfirmedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      // 保存到localStorage
      saveReviewStateToLocalStorage(newState, rejectedKnowledgePoints);
      return newState;
    });
  }, [confirmedKnowledgePoints, rejectedKnowledgePoints, saveReviewStateToLocalStorage]);

  // 检查知识点是否已确认
  const isKnowledgePointConfirmed = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    return !!confirmedKnowledgePoints[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
  }, [confirmedKnowledgePoints]);

  // 检查知识点是否已拒绝
  const isKnowledgePointRejected = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    return !!rejectedKnowledgePoints[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
  }, [rejectedKnowledgePoints]);

  // 取消确认知识点
  const cancelConfirmKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setConfirmedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      // 保存到localStorage
      saveReviewStateToLocalStorage(newState, rejectedKnowledgePoints);
      return newState;
    });
  }, [rejectedKnowledgePoints, saveReviewStateToLocalStorage]);

  // 取消拒绝知识点
  const cancelRejectKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setRejectedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      // 保存到localStorage
      saveReviewStateToLocalStorage(confirmedKnowledgePoints, newState);
      return newState;
    });
  }, [confirmedKnowledgePoints, saveReviewStateToLocalStorage]);

  // 编辑知识点
  const editKnowledgePoint = useCallback((submissionId, knowledgePointId, updatedKnowledgePoint, isExisting = true) => {
    // 更新提交中的知识点数据
    setSubmissionsWithKnowledge(prev => {
      return prev.map(submission => {
        if (submission.id !== submissionId) return submission;

        const newSubmission = { ...submission };
        const knowledgeMarks = { ...newSubmission.data.knowledgeMarks };

        if (isExisting) {
          // 更新已有知识点
          knowledgeMarks.existing_knowledge_points = knowledgeMarks.existing_knowledge_points.map(point => {
            if (point.id === knowledgePointId) {
              return { ...point, ...updatedKnowledgePoint };
            }
            return point;
          });
        } else {
          // 更新新知识点
          knowledgeMarks.new_knowledge_points = knowledgeMarks.new_knowledge_points.map(point => {
            if (point.item === knowledgePointId) {
              return { ...point, ...updatedKnowledgePoint };
            }
            return point;
          });
        }

        newSubmission.data = { ...newSubmission.data, knowledgeMarks };
        return newSubmission;
      });
    });

    // 直接更新 Zustand store 中的数据
    try {
      // 获取当前提交的数据
      const submission = getSubmission(submissionId);
      if (submission && submission.data && submission.data.knowledgeMarks) {
        const knowledgeMarks = { ...submission.data.knowledgeMarks };

        if (isExisting && knowledgeMarks.existing_knowledge_points) {
          // 更新已有知识点
          knowledgeMarks.existing_knowledge_points = knowledgeMarks.existing_knowledge_points.map(point => {
            if (point.id === knowledgePointId) {
              return { ...point, ...updatedKnowledgePoint };
            }
            return point;
          });
        } else if (!isExisting && knowledgeMarks.new_knowledge_points) {
          // 更新新知识点
          knowledgeMarks.new_knowledge_points = knowledgeMarks.new_knowledge_points.map(point => {
            if (point.item === knowledgePointId) {
              return { ...point, ...updatedKnowledgePoint };
            }
            return point;
          });
        }

        // 直接更新 Zustand store
        updateSubmissionStep(submissionId, 'knowledgeMarks', submission.steps.knowledgeMarks, knowledgeMarks);
      }

      // 直接更新localStorage中的数据
      const storageKey = 'gradnote-submissions';
      const storageData = JSON.parse(localStorage.getItem(storageKey));

      if (storageData && storageData.state && storageData.state.submissions) {
        // 找到对应的submission
        const submissions = storageData.state.submissions;
        const submissionIndex = submissions.findIndex(s => s.id === submissionId);

        if (submissionIndex !== -1) {
          const submission = submissions[submissionIndex];

          // 确保数据结构存在
          if (submission.data && submission.data.knowledgeMarks) {
            const knowledgeMarks = submission.data.knowledgeMarks;

            if (isExisting && knowledgeMarks.existing_knowledge_points) {
              // 更新已有知识点
              knowledgeMarks.existing_knowledge_points = knowledgeMarks.existing_knowledge_points.map(point => {
                if (point.id === knowledgePointId) {
                  return { ...point, ...updatedKnowledgePoint };
                }
                return point;
              });
            } else if (!isExisting && knowledgeMarks.new_knowledge_points) {
              // 更新新知识点
              knowledgeMarks.new_knowledge_points = knowledgeMarks.new_knowledge_points.map(point => {
                if (point.item === knowledgePointId) {
                  return { ...point, ...updatedKnowledgePoint };
                }
                return point;
              });
            }

            // 更新localStorage
            localStorage.setItem(storageKey, JSON.stringify(storageData));
          }
        }
      }
      message.success('知识点编辑成功');
    } catch (error) {
      console.error('更新知识点数据失败', error);
      message.error('知识点编辑失败: ' + (error.message || '未知错误'));
    }
  }, [getSubmission, updateSubmissionStep]);

  // 提交确认的知识点
  const submitConfirmedKnowledgePoints = useCallback(async (submissionId) => {
    const submission = getSubmission(submissionId);
    if (!submission || !submission.questionId) {
      message.error('无法找到相关错题信息');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 直接从 localStorage 中获取最新的知识点数据
      const storageKey = 'gradnote-submissions';
      const storageData = JSON.parse(localStorage.getItem(storageKey));
      let knowledgeMarksData;

      if (storageData && storageData.state && storageData.state.submissions) {
        const storageSubmission = storageData.state.submissions.find(s => s.id === submissionId);
        if (storageSubmission && storageSubmission.data && storageSubmission.data.knowledgeMarks) {
          knowledgeMarksData = storageSubmission.data.knowledgeMarks;
        }
      }

      // 如果从 localStorage 中无法获取数据，则使用内存中的数据
      if (!knowledgeMarksData) {
        const currentSubmission = submissionsWithKnowledge.find(s => s.id === submissionId);
        if (!currentSubmission) {
          message.error('无法找到相关知识点信息');
          return;
        }
        knowledgeMarksData = currentSubmission.data.knowledgeMarks;
      }

      // 准备已有知识点ID列表
      const existingKnowledgePointIds = knowledgeMarksData.existing_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.id, true))
        .map(point => point.id);

      // 准备新知识点列表
      const newKnowledgePoints = knowledgeMarksData.new_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.item, false))
        .map(point => {
          // 使用已经在 localStorage 中更新过的数据
          return {
            subject: point.subject,
            chapter: point.chapter,
            section: point.section,
            item: point.item,
            details: point.details || null
          };
        });

      // 调用API
      await markConfirmedKnowledgePoints({
        question_id: submission.questionId,
        existing_knowledge_point_ids: existingKnowledgePointIds,
        new_knowledge_points: newKnowledgePoints
      });

      // 更新审核状态为已审核
      // 先保存当前的知识点数据
      const currentStorageData = JSON.parse(localStorage.getItem(storageKey));
      if (currentStorageData && currentStorageData.state && currentStorageData.state.submissions) {
        const currentSubmissionIndex = currentStorageData.state.submissions.findIndex(s => s.id === submissionId);
        if (currentSubmissionIndex !== -1) {
          // 保存当前的知识点数据
          const currentSubmissionData = { ...currentStorageData.state.submissions[currentSubmissionIndex] };

          // 确保知识点数据包含已确认的知识点
          if (currentSubmissionData.data && currentSubmissionData.data.knowledgeMarks) {
            // 将已确认的知识点状态保存到submission数据中
            // 这样即使页面刷新，也能知道哪些知识点已确认
            currentSubmissionData.data.confirmedKnowledgePoints = {};

            // 为当前submission保存已确认的知识点
            Object.keys(confirmedKnowledgePoints).forEach(key => {
              if (key.startsWith(`${submissionId}_`)) {
                currentSubmissionData.data.confirmedKnowledgePoints[key] = true;
              }
            });

            // 更新submission数据
            currentStorageData.state.submissions[currentSubmissionIndex] = currentSubmissionData;
            localStorage.setItem(storageKey, JSON.stringify(currentStorageData));
          }

          // 更新审核状态
          updateReviewStatus(submissionId, REVIEW_STATUS.REVIEWED);
        } else {
          // 如果找不到当前提交，直接更新审核状态
          updateReviewStatus(submissionId, REVIEW_STATUS.REVIEWED);
        }
      } else {
        // 如果无法获取 localStorage 数据，直接更新审核状态
        updateReviewStatus(submissionId, REVIEW_STATUS.REVIEWED);
      }

      message.success('知识点标记成功');
    } catch (err) {
      setError(err.message || '标记知识点时发生错误');
      message.error('标记知识点失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [getSubmission, isKnowledgePointConfirmed, submissionsWithKnowledge, updateReviewStatus]);

  // 开始审核
  const startReview = useCallback((submissionId) => {
    updateReviewStatus(submissionId, REVIEW_STATUS.REVIEWING);
  }, [updateReviewStatus]);

  // 开始重新审核
  const startReReview = useCallback((submissionId) => {
    updateReviewStatus(submissionId, REVIEW_STATUS.REVIEWING);
  }, [updateReviewStatus]);

  return {
    // 状态
    loading,
    error,
    submissionsWithKnowledge,

    // 方法
    confirmKnowledgePoint,
    rejectKnowledgePoint,
    cancelConfirmKnowledgePoint,
    cancelRejectKnowledgePoint,
    isKnowledgePointConfirmed,
    isKnowledgePointRejected,
    editKnowledgePoint,
    submitConfirmedKnowledgePoints,
    startReview,
    startReReview
  };
};

export default useKnowledgeReview;
