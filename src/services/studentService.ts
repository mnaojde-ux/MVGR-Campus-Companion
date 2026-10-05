import { MOCK_STUDENTS, DEFAULT_STUDENT_ID, StudentProfile } from '../data/student';

/**
 * Student Service Layer
 * Abstracted API client for student credentials, profile details, and session state.
 * Currently backed by mock campus data; easily switched to authenticated CampX/MVGR API.
 */
export const studentService = {
  async getStudentProfile(studentId: string = DEFAULT_STUDENT_ID): Promise<StudentProfile> {
    // Simulated fast network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 60));
    const profile = MOCK_STUDENTS[studentId] || MOCK_STUDENTS[DEFAULT_STUDENT_ID];
    return { ...profile };
  },

  async authenticateStudent(identifier: string, pass: string): Promise<{ success: boolean; studentId?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const clean = identifier.trim().toLowerCase();
    
    // Support Arjun demo or roll number starting with 24
    if (clean === 'arjun' || clean.includes('24331a') || clean.includes('arjun.verma')) {
      return { success: true, studentId: 'arjun' };
    }

    // Support Manoj demo or roll number starting with 22 or standard student login
    if (clean === 'manoj' || clean.includes('22331a') || clean.includes('manoj.kumar') || clean === 'student') {
      return { success: true, studentId: 'manoj' };
    }

    // Realistic validation
    if (clean.length < 4) {
      return { success: false, error: 'Please enter a valid MVGR Roll Number (e.g. 22331A0589) or Student Email.' };
    }

    // Allow any standard roll number pattern
    return { success: true, studentId: 'manoj' };
  },
};
