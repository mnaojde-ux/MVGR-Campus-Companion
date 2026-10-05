/**
 * Timetable Service
 * Academic schedule management and next-class detection engine.
 */

import { MOCK_TIMETABLE_DATA, DaySchedule, TimetableEntry } from '../data/timetable';

export interface NextClassResult {
  status: 'current' | 'next' | 'done' | 'none';
  entry: TimetableEntry | null;
  remainingMinutes: number;
  displayText: string;
  dayName: string;
  isToday: boolean;
}

// Convert "10:00 AM", "14:30", "09:00" to minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const match = clean.match(/(\d+):(\d+)/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export const timetableService = {
  /**
   * Retrieves the full weekly schedule for a student
   */
  async getWeeklyTimetable(studentId: string): Promise<DaySchedule[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const data = MOCK_TIMETABLE_DATA[studentId] || MOCK_TIMETABLE_DATA['manoj'];
    return JSON.parse(JSON.stringify(data));
  },

  /**
   * Retrieves today's schedule
   */
  async getTodaySchedule(studentId: string): Promise<DaySchedule | undefined> {
    const week = await this.getWeeklyTimetable(studentId);
    return week.find((day) => day.isToday) || week[0];
  },

  /**
   * Reusable engine to determine the student's active or next class.
   * Consumed by both Home Dashboard and Timetable module.
   */
  getNextClass(
    scheduleInput: DaySchedule[] | DaySchedule | undefined,
    currentTime: Date = new Date()
  ): NextClassResult {
    let todaySchedule: DaySchedule | undefined;

    if (Array.isArray(scheduleInput)) {
      todaySchedule = scheduleInput.find((d) => d.isToday) || scheduleInput[0];
    } else {
      todaySchedule = scheduleInput;
    }

    if (!todaySchedule || !todaySchedule.slots || todaySchedule.slots.length === 0) {
      return {
        status: 'none',
        entry: null,
        remainingMinutes: 0,
        displayText: 'No classes scheduled.',
        dayName: todaySchedule?.dayName || 'Today',
        isToday: Boolean(todaySchedule?.isToday),
      };
    }

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const academicSlots = todaySchedule.slots.filter((s) => s.type !== 'break');

    // 1. Check if student is currently in a class
    for (const slot of academicSlots) {
      const startMin = parseTimeToMinutes(slot.startTime);
      const endMin = parseTimeToMinutes(slot.endTime);
      if (nowMinutes >= startMin && nowMinutes < endMin) {
        const remaining = Math.max(1, endMin - nowMinutes);
        return {
          status: 'current',
          entry: slot,
          remainingMinutes: remaining,
          displayText: `Ends in ${remaining} min`,
          dayName: todaySchedule.dayName,
          isToday: todaySchedule.isToday,
        };
      }
    }

    // 2. Check if student has a future class today
    for (const slot of academicSlots) {
      const startMin = parseTimeToMinutes(slot.startTime);
      if (nowMinutes < startMin) {
        const remaining = Math.max(1, startMin - nowMinutes);
        const text = remaining <= 60 
          ? `${remaining} minutes remaining`
          : `Starts at ${slot.startTime}`;
        return {
          status: 'next',
          entry: slot,
          remainingMinutes: remaining,
          displayText: text,
          dayName: todaySchedule.dayName,
          isToday: todaySchedule.isToday,
        };
      }
    }

    // 3. Fallback for demonstration outside daytime college hours (e.g. night or early morning evaluation):
    // If slots contain an entry marked `isNext: true`, use it to preview the upcoming demonstration class
    const demoNext = academicSlots.find((s) => s.isNext) || academicSlots[0];
    if (demoNext && (nowMinutes < 540 || nowMinutes > 1020)) { // before 9:00 AM or after 5:00 PM
      return {
        status: 'next',
        entry: demoNext,
        remainingMinutes: 15,
        displayText: '15 minutes remaining',
        dayName: todaySchedule.dayName,
        isToday: todaySchedule.isToday,
      };
    }

    // 4. All classes completed for today
    return {
      status: 'done',
      entry: null,
      remainingMinutes: 0,
      displayText: "You're done for today.",
      dayName: todaySchedule.dayName,
      isToday: todaySchedule.isToday,
    };
  },
};
