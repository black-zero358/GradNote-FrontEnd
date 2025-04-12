import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STEP_STATUS } from '../components/common/StepIndicator';

/**
 * 提交状态存储
 * 管理错题提交实例的状态
 */
const useSubmissionStore = create(
  persist(
    (set, get) => ({
      // 提交实例列表
      submissions: [],
      
      // 当前选中的提交ID
      selectedSubmissionId: null,
      
      // 添加新提交
      addSubmission: (imageFile) => {
        const newSubmission = {
          id: Date.now().toString(),
          imageFile, // 原始图片文件
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
          questionId: null, // 关联的题目ID
          steps: {
            ocr: STEP_STATUS.PENDING,
            answer: STEP_STATUS.PENDING,
            knowledge: STEP_STATUS.PENDING,
            solving: STEP_STATUS.PENDING,
            knowledgeMarks: STEP_STATUS.PENDING
          },
          data: {}, // 各步骤的数据
          errors: {}, // 各步骤的错误
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          submissions: [...state.submissions, newSubmission],
          selectedSubmissionId: newSubmission.id
        }));
        
        return newSubmission.id;
      },
      
      // 更新提交状态
      updateSubmissionStep: (submissionId, stepName, status, data = null, error = null) => {
        set(state => {
          const submissions = [...state.submissions];
          const index = submissions.findIndex(s => s.id === submissionId);
          
          if (index === -1) return state;
          
          const submission = { ...submissions[index] };
          submission.steps = { ...submission.steps, [stepName]: status };
          
          // 更新数据或错误
          if (data) {
            submission.data = { ...submission.data, [stepName]: data };
          }
          
          if (error) {
            submission.errors = { ...submission.errors, [stepName]: error };
          }
          
          submissions[index] = submission;
          return { submissions };
        });
      },
      
      // 设置问题ID
      setQuestionId: (submissionId, questionId) => {
        set(state => {
          const submissions = [...state.submissions];
          const index = submissions.findIndex(s => s.id === submissionId);
          
          if (index === -1) return state;
          
          const submission = { ...submissions[index], questionId };
          submissions[index] = submission;
          return { submissions };
        });
      },
      
      // 更新OCR文本
      updateOcrText: (submissionId, text) => {
        set(state => {
          const submissions = [...state.submissions];
          const index = submissions.findIndex(s => s.id === submissionId);
          
          if (index === -1) return state;
          
          const submission = { ...submissions[index] };
          const ocrData = { ...(submission.data.ocr || {}), text };
          submission.data = { ...submission.data, ocr: ocrData };
          
          submissions[index] = submission;
          return { submissions };
        });
      },
      
      // 更新答案文本
      updateAnswerText: (submissionId, text) => {
        set(state => {
          const submissions = [...state.submissions];
          const index = submissions.findIndex(s => s.id === submissionId);
          
          if (index === -1) return state;
          
          const submission = { ...submissions[index] };
          const answerData = { ...(submission.data.answer || {}), text };
          submission.data = { ...submission.data, answer: answerData };
          
          submissions[index] = submission;
          return { submissions };
        });
      },
      
      // 删除提交
      removeSubmission: (submissionId) => {
        set(state => {
          const submissions = state.submissions.filter(s => s.id !== submissionId);
          
          // 如果删除的是当前选中的提交，重置选中状态
          const selectedSubmissionId = 
            state.selectedSubmissionId === submissionId
              ? (submissions.length > 0 ? submissions[0].id : null)
              : state.selectedSubmissionId;
              
          return { submissions, selectedSubmissionId };
        });
      },
      
      // 选择提交
      selectSubmission: (submissionId) => {
        set({ selectedSubmissionId: submissionId });
      },
      
      // 获取提交
      getSubmission: (submissionId) => {
        return get().submissions.find(s => s.id === submissionId);
      },
      
      // 获取当前选中的提交
      getSelectedSubmission: () => {
        const { submissions, selectedSubmissionId } = get();
        return submissions.find(s => s.id === selectedSubmissionId);
      },
      
      // 清空所有提交
      clearSubmissions: () => {
        set({ submissions: [], selectedSubmissionId: null });
      }
    }),
    {
      name: 'gradnote-submissions',
      partialize: (state) => {
        // 不持久化图片文件和URL，只保存必要的状态信息
        return {
          submissions: state.submissions.map(submission => {
            const { imageFile, ...rest } = submission;
            return rest;
          })
        };
      }
    }
  )
);

export default useSubmissionStore;
