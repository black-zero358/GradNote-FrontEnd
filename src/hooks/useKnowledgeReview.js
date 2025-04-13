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

      // 准备已有知识点ID列表
      const existingKnowledgePointIds = submission.data.knowledgeMarks.existing_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.id, true))
        .map(point => point.id);

      // 准备新知识点列表
      const newKnowledgePoints = submission.data.knowledgeMarks.new_knowledge_points
        .filter(point => isKnowledgePointConfirmed(submissionId, point.item, false))
        .map(point => ({
          subject: point.subject,
          chapter: point.chapter,
          section: point.section,
          item: point.item,
          details: point.details || null
        }));

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
  }, [getSubmission, isKnowledgePointConfirmed]);

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
    submitConfirmedKnowledgePoints
  };
};

export default useKnowledgeReview;
