/**
 * Attendance Service
 * Decoupled business logic and calculation engine for student attendance analytics.
 */

import { MOCK_ATTENDANCE_DATA, AttendanceRecord, SubjectAttendance } from '../data/attendance';

export interface AttendanceInsight {
  percentage: number;
  status: 'healthy' | 'attention' | 'critical';
  classesCanMiss: number;
  classesNeededToReach: number;
  summaryMessage: string;
  detailedInsight: string;
}

export const attendanceService = {
  /**
   * Retrieves the student's attendance record
   */
  async getAttendanceRecord(studentId: string): Promise<AttendanceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const record = MOCK_ATTENDANCE_DATA[studentId] || MOCK_ATTENDANCE_DATA['manoj'];
    return JSON.parse(JSON.stringify(record));
  },

  /**
   * Calculates actionable insights for a given subject based on a configurable threshold.
   * Threshold is represented as an integer (e.g. 75 for 75%).
   */
  calculateAttendanceInsight(
    attended: number,
    total: number,
    thresholdPercentage: number = 75
  ): AttendanceInsight {
    if (total === 0) {
      return {
        percentage: 100,
        status: 'healthy',
        classesCanMiss: 0,
        classesNeededToReach: 0,
        summaryMessage: 'No classes conducted yet.',
        detailedInsight: 'Course attendance has not started.',
      };
    }

    const percentage = Math.round((attended / total) * 100);
    const T = thresholdPercentage / 100; // e.g. 0.75

    // Restrained status determination relative to configurable threshold
    let status: 'healthy' | 'attention' | 'critical' = 'healthy';
    if (percentage < thresholdPercentage) {
      status = 'critical';
    } else if (percentage < thresholdPercentage + 5) {
      status = 'attention';
    }

    if (percentage >= thresholdPercentage) {
      // How many classes can be missed before dropping below T?
      // A / (total + m) >= T  =>  m <= (A / T) - total
      const maxMissable = Math.max(0, Math.floor(attended / T - total));

      let detailedInsight = '';
      if (maxMissable > 0) {
        detailedInsight = `You can safely miss up to ${maxMissable} class${
          maxMissable > 1 ? 'es' : ''
        } and still remain above the ${thresholdPercentage}% threshold.`;
      } else {
        detailedInsight = `You are currently right at the ${thresholdPercentage}% margin. Missing your next class will cause attendance to fall below ${thresholdPercentage}%.`;
      }

      return {
        percentage,
        status,
        classesCanMiss: maxMissable,
        classesNeededToReach: 0,
        summaryMessage: `At your current attendance, you have attended ${attended} of ${total} classes (${percentage}%).`,
        detailedInsight,
      };
    } else {
      // How many consecutive classes must be attended to reach T?
      // (A + c) / (total + c) >= T  =>  c >= (T * total - A) / (1 - T)
      const needed = Math.max(1, Math.ceil((T * total - attended) / (1 - T)));

      return {
        percentage,
        status,
        classesCanMiss: 0,
        classesNeededToReach: needed,
        summaryMessage: `At your current attendance, you have attended ${attended} of ${total} classes (${percentage}%).`,
        detailedInsight: `Attend the next ${needed} consecutive class${
          needed > 1 ? 'es' : ''
        } without absence to restore your attendance to ${thresholdPercentage}%.`,
      };
    }
  },
};
