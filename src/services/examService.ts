import { MOCK_UPCOMING_EXAMS, MOCK_PAST_EXAMS, ExamItem, PastExamItem } from '../data/exams';

export const examService = {
  async getUpcomingExams(studentId: string): Promise<ExamItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return MOCK_UPCOMING_EXAMS[studentId] || MOCK_UPCOMING_EXAMS['manoj'] || [];
  },

  async getPastExamRecords(studentId: string): Promise<PastExamItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return MOCK_PAST_EXAMS[studentId] || MOCK_PAST_EXAMS['manoj'] || [];
  },
};
