import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import useSubmissionStore from '../stores/submissionStore';
import { markConfirmedKnowledgePoints } from '../api/knowledge.service';

/**
 * 知识点审核页面的自定义Hook
 * 处理知识点审核相关的状态和逻辑
 */
const useKnowledgeReview = () => {
  // 从store获取提交列表
  const { submissions, getSubmission } = useSubmissionStore();

  // 本地状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionsWithKnowledge, setSubmissionsWithKnowledge] = useState([]);

  // 已确认和已拒绝的知识点ID映射
  const [confirmedKnowledgePoints, setConfirmedKnowledgePoints] = useState({});
  const [rejectedKnowledgePoints, setRejectedKnowledgePoints] = useState({});

  // 已编辑的知识点映射
  const [editedKnowledgePoints, setEditedKnowledgePoints] = useState({});

  // 初始化时过滤出包含知识点的提交
  useEffect(() => {
    const filteredSubmissions = submissions.filter(submission => {
      // 检查是否有knowledgeMarks数据
      return (
        submission.data &&
        submission.data.knowledgeMarks &&
        (
          (submission.data.knowledgeMarks.existing_knowledge_points &&
           submission.data.knowledgeMarks.existing_knowledge_points.length > 0) ||
          (submission.data.knowledgeMarks.new_knowledge_points &&
           submission.data.knowledgeMarks.new_knowledge_points.length > 0)
        )
      );
    });

    setSubmissionsWithKnowledge(filteredSubmissions);
  }, [submissions]);

  // 确认知识点
  const confirmKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setConfirmedKnowledgePoints(prev => ({
      ...prev,
      [`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`]: true
    }));

    // 如果之前被拒绝，则移除拒绝状态
    setRejectedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      return newState;
    });
  }, []);

  // 拒绝知识点
  const rejectKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setRejectedKnowledgePoints(prev => ({
      ...prev,
      [`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`]: true
    }));

    // 如果之前被确认，则移除确认状态
    setConfirmedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      return newState;
    });
  }, []);

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
      return newState;
    });
  }, []);

  // 取消拒绝知识点
  const cancelRejectKnowledgePoint = useCallback((submissionId, knowledgePointId, isExisting = true) => {
    setRejectedKnowledgePoints(prev => {
      const newState = { ...prev };
      delete newState[`${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`];
      return newState;
    });
  }, []);

  // 编辑知识点
  const editKnowledgePoint = useCallback((submissionId, knowledgePointId, updatedKnowledgePoint, isExisting = true) => {
    const key = `${submissionId}_${knowledgePointId}_${isExisting ? 'existing' : 'new'}`;

    setEditedKnowledgePoints(prev => ({
      ...prev,
      [key]: updatedKnowledgePoint
    }));

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

    message.success('知识点编辑成功');
  }, []);

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

      // 获取当前提交中的知识点数据
      const currentSubmission = submissionsWithKnowledge.find(s => s.id === submissionId);
      if (!currentSubmission) {
        message.error('无法找到相关知识点信息');
        return;
      }

      const knowledgeMarksData = currentSubmission.data.knowledgeMarks;

      // 准备已有知识点ID列表
      const existingKnowledgePointIds = knowledgeMarksData.existing_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.id, true))
        .map(point => point.id);

      // 准备新知识点列表
      const newKnowledgePoints = knowledgeMarksData.new_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.item, false))
        .map(point => {
          // 检查是否有编辑过的知识点
          const editedKey = `${submissionId}_${point.item}_new`;
          const editedPoint = editedKnowledgePoints[editedKey];

          // 使用编辑过的知识点数据或原始数据
          const finalPoint = editedPoint || point;

          return {
            subject: finalPoint.subject,
            chapter: finalPoint.chapter,
            section: finalPoint.section,
            item: finalPoint.item,
            details: finalPoint.details || null
          };
        });

      // 调用API
      await markConfirmedKnowledgePoints({
        question_id: submission.questionId,
        existing_knowledge_point_ids: existingKnowledgePointIds,
        new_knowledge_points: newKnowledgePoints
      });

      message.success('知识点标记成功');
    } catch (err) {
      setError(err.message || '标记知识点时发生错误');
      message.error('标记知识点失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [getSubmission, isKnowledgePointConfirmed, submissionsWithKnowledge, editedKnowledgePoints]);

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
    submitConfirmedKnowledgePoints
  };
};

export default useKnowledgeReview;
