/**
 * Attendance Data Model & Mock Data
 * MVGR College of Engineering (Autonomous), Vizianagaram
 */

export interface AttendanceHistoryEntry {
  id: string;
  date: string; // e.g. "04 Oct 2026", "01 Oct 2026"
  status: 'present' | 'absent' | 'excused';
  sessionName?: string; // e.g. "Lecture 2", "Lab Practical"
  time?: string;        // e.g. "10:00 AM – 10:50 AM"
}

export interface SubjectAttendance {
  id: string;
  subjectId: string;
  code: string;
  name: string;
  subjectName: string;
  faculty: string;
  attended: number;
  total: number;
  percentage: number;
  threshold?: number;
  status: 'healthy' | 'attention' | 'critical' | 'good' | 'warning';
  statusLabel?: string;
  minRequiredPercentage: number;
  placeId: string; // connects to CampusPlace for classroom map view
  locationName: string;
  history: AttendanceHistoryEntry[];
}

export interface AttendanceRecord {
  overallPercentage: number;
  totalAttended: number;
  totalConducted: number;
  totalMissed: number;
  minRequiredThreshold: number;
  lastUpdated: string;
  subjects: SubjectAttendance[];
}

export const MOCK_ATTENDANCE_DATA: Record<string, AttendanceRecord> = {
  manoj: {
    overallPercentage: 84,
    totalAttended: 216,
    totalConducted: 257,
    totalMissed: 41,
    minRequiredThreshold: 75,
    lastUpdated: 'Today at 08:30 AM (Academic ERP Sync)',
    subjects: [
      {
        id: 'sub-ml',
        subjectId: 'sub-ml',
        code: '20CS601',
        name: 'Machine Learning',
        subjectName: 'Machine Learning',
        faculty: 'Dr. Ch. Purnachandra Rao',
        attended: 39,
        total: 48,
        percentage: 81,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Safe buffer above 75%',
        minRequiredPercentage: 75,
        placeId: 'cse-block',
        locationName: 'CSE Block (Room 204)',
        history: [
          { id: 'h1', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 48', time: '10:00 AM – 10:50 AM' },
          { id: 'h2', date: '03 Oct 2026', status: 'present', sessionName: 'Lecture 47', time: '10:00 AM – 10:50 AM' },
          { id: 'h3', date: '01 Oct 2026', status: 'absent', sessionName: 'Lecture 46', time: '10:00 AM – 10:50 AM' },
          { id: 'h4', date: '29 Sep 2026', status: 'present', sessionName: 'Lecture 45', time: '10:00 AM – 10:50 AM' },
          { id: 'h5', date: '26 Sep 2026', status: 'present', sessionName: 'Lecture 44', time: '10:00 AM – 10:50 AM' },
          { id: 'h6', date: '24 Sep 2026', status: 'present', sessionName: 'Lecture 43', time: '10:00 AM – 10:50 AM' },
          { id: 'h7', date: '22 Sep 2026', status: 'absent', sessionName: 'Lecture 42', time: '10:00 AM – 10:50 AM' },
          { id: 'h8', date: '19 Sep 2026', status: 'present', sessionName: 'Lecture 41', time: '10:00 AM – 10:50 AM' },
        ],
      },
      {
        id: 'sub-ds',
        subjectId: 'sub-ds',
        code: '20CS602',
        name: 'Data Structures & Algorithms',
        subjectName: 'Data Structures & Algorithms',
        faculty: 'Prof. S. R. K. Prasad',
        attended: 44,
        total: 50,
        percentage: 88,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Excellent standing (88%)',
        minRequiredPercentage: 75,
        placeId: 'cse-block',
        locationName: 'CSE Block (Room 102)',
        history: [
          { id: 'h11', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 50', time: '09:00 AM – 09:50 AM' },
          { id: 'h12', date: '03 Oct 2026', status: 'present', sessionName: 'Lecture 49', time: '09:00 AM – 09:50 AM' },
          { id: 'h13', date: '01 Oct 2026', status: 'present', sessionName: 'Lecture 48', time: '09:00 AM – 09:50 AM' },
          { id: 'h14', date: '28 Sep 2026', status: 'present', sessionName: 'Lecture 47', time: '09:00 AM – 09:50 AM' },
          { id: 'h15', date: '25 Sep 2026', status: 'absent', sessionName: 'Lecture 46', time: '09:00 AM – 09:50 AM' },
          { id: 'h16', date: '23 Sep 2026', status: 'present', sessionName: 'Lecture 45', time: '09:00 AM – 09:50 AM' },
        ],
      },
      {
        id: 'sub-dbms',
        subjectId: 'sub-dbms',
        code: '20CS603',
        name: 'Database Management Systems',
        subjectName: 'Database Management Systems',
        faculty: 'Dr. G. Anuradha',
        attended: 38,
        total: 50,
        percentage: 76,
        threshold: 75,
        status: 'attention',
        statusLabel: 'Borderline margin (76%)',
        minRequiredPercentage: 75,
        placeId: 'cse-block',
        locationName: 'CSE Block (Room 201)',
        history: [
          { id: 'h21', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 50', time: '11:40 AM – 12:30 PM' },
          { id: 'h22', date: '02 Oct 2026', status: 'absent', sessionName: 'Lecture 49', time: '11:40 AM – 12:30 PM' },
          { id: 'h23', date: '30 Sep 2026', status: 'present', sessionName: 'Lecture 48', time: '11:40 AM – 12:30 PM' },
          { id: 'h24', date: '28 Sep 2026', status: 'absent', sessionName: 'Lecture 47', time: '11:40 AM – 12:30 PM' },
          { id: 'h25', date: '25 Sep 2026', status: 'present', sessionName: 'Lecture 46', time: '11:40 AM – 12:30 PM' },
          { id: 'h26', date: '23 Sep 2026', status: 'present', sessionName: 'Lecture 45', time: '11:40 AM – 12:30 PM' },
          { id: 'h27', date: '21 Sep 2026', status: 'absent', sessionName: 'Lecture 44', time: '11:40 AM – 12:30 PM' },
        ],
      },
      {
        id: 'sub-math',
        subjectId: 'sub-math',
        code: '20MA601',
        name: 'Probability & Statistics',
        subjectName: 'Probability & Statistics',
        faculty: 'Dr. V. S. N. Murthy',
        attended: 41,
        total: 45,
        percentage: 91,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Exemplary attendance (91%)',
        minRequiredPercentage: 75,
        placeId: 'bsh-block',
        locationName: 'BS&H Block (Hall 3)',
        history: [
          { id: 'h31', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 45', time: '02:00 PM – 02:50 PM' },
          { id: 'h32', date: '02 Oct 2026', status: 'present', sessionName: 'Lecture 44', time: '02:00 PM – 02:50 PM' },
          { id: 'h33', date: '30 Sep 2026', status: 'present', sessionName: 'Lecture 43', time: '02:00 PM – 02:50 PM' },
          { id: 'h34', date: '27 Sep 2026', status: 'present', sessionName: 'Lecture 42', time: '02:00 PM – 02:50 PM' },
          { id: 'h35', date: '25 Sep 2026', status: 'absent', sessionName: 'Lecture 41', time: '02:00 PM – 02:50 PM' },
        ],
      },
      {
        id: 'sub-del',
        subjectId: 'sub-del',
        code: '20CS605',
        name: 'Digital Engineering Lab (Practical)',
        subjectName: 'Digital Engineering Lab (Practical)',
        faculty: 'Mr. B. V. Raman',
        attended: 28,
        total: 30,
        percentage: 93,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'High lab attendance (93%)',
        minRequiredPercentage: 75,
        placeId: 'del-lab',
        locationName: 'Digital Engineering Lab (Lab 3)',
        history: [
          { id: 'h41', date: '03 Oct 2026', status: 'present', sessionName: 'Lab Session 30', time: '02:00 PM – 04:30 PM' },
          { id: 'h42', date: '26 Sep 2026', status: 'present', sessionName: 'Lab Session 29', time: '02:00 PM – 04:30 PM' },
          { id: 'h43', date: '19 Sep 2026', status: 'present', sessionName: 'Lab Session 28', time: '02:00 PM – 04:30 PM' },
          { id: 'h44', date: '12 Sep 2026', status: 'absent', sessionName: 'Lab Session 27', time: '02:00 PM – 04:30 PM' },
        ],
      },
      {
        id: 'sub-tc',
        subjectId: 'sub-tc',
        code: '20HS601',
        name: 'Professional Communication',
        subjectName: 'Professional Communication',
        faculty: 'Mrs. M. Sunitha',
        attended: 26,
        total: 34,
        percentage: 76,
        threshold: 75,
        status: 'attention',
        statusLabel: 'Close to threshold (76%)',
        minRequiredPercentage: 75,
        placeId: 'admin-block',
        locationName: 'Language Lab, Admin Block',
        history: [
          { id: 'h51', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 34', time: '03:40 PM – 04:30 PM' },
          { id: 'h52', date: '02 Oct 2026', status: 'absent', sessionName: 'Lecture 33', time: '03:40 PM – 04:30 PM' },
          { id: 'h53', date: '29 Sep 2026', status: 'present', sessionName: 'Lecture 32', time: '03:40 PM – 04:30 PM' },
          { id: 'h54', date: '25 Sep 2026', status: 'absent', sessionName: 'Lecture 31', time: '03:40 PM – 04:30 PM' },
          { id: 'h55', date: '22 Sep 2026', status: 'present', sessionName: 'Lecture 30', time: '03:40 PM – 04:30 PM' },
          { id: 'h56', date: '18 Sep 2026', status: 'absent', sessionName: 'Lecture 29', time: '03:40 PM – 04:30 PM' },
        ],
      },
    ],
  },
  arjun: {
    overallPercentage: 89,
    totalAttended: 116,
    totalConducted: 130,
    totalMissed: 14,
    minRequiredThreshold: 75,
    lastUpdated: 'Today at 08:30 AM (Academic ERP Sync)',
    subjects: [
      {
        id: 'sub-phy',
        subjectId: 'sub-phy',
        code: '24BS101',
        name: 'Engineering Physics',
        subjectName: 'Engineering Physics',
        faculty: 'Dr. M. V. Subba Rao',
        attended: 28,
        total: 30,
        percentage: 93,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Excellent standing (93%)',
        minRequiredPercentage: 75,
        placeId: 'bsh-block',
        locationName: 'BS&H Block (Room BSH-04)',
        history: [
          { id: 'ha1', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 30' },
          { id: 'ha2', date: '02 Oct 2026', status: 'present', sessionName: 'Lecture 29' },
          { id: 'ha3', date: '30 Sep 2026', status: 'absent', sessionName: 'Lecture 28' },
          { id: 'ha4', date: '28 Sep 2026', status: 'present', sessionName: 'Lecture 27' },
        ],
      },
      {
        id: 'sub-cp',
        subjectId: 'sub-cp',
        code: '24CS101',
        name: 'Problem Solving Using C',
        subjectName: 'Problem Solving Using C',
        faculty: 'Prof. K. Sandhya',
        attended: 32,
        total: 35,
        percentage: 91,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'High attendance (91%)',
        minRequiredPercentage: 75,
        placeId: 'cse-block',
        locationName: 'CSE Block (Room 101)',
        history: [
          { id: 'hb1', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 35' },
          { id: 'hb2', date: '03 Oct 2026', status: 'present', sessionName: 'Lecture 34' },
          { id: 'hb3', date: '01 Oct 2026', status: 'present', sessionName: 'Lecture 33' },
          { id: 'hb4', date: '29 Sep 2026', status: 'absent', sessionName: 'Lecture 32' },
        ],
      },
      {
        id: 'sub-m1',
        subjectId: 'sub-m1',
        code: '24MA101',
        name: 'Linear Algebra & Calculus',
        subjectName: 'Linear Algebra & Calculus',
        faculty: 'Dr. T. Harikrishna',
        attended: 31,
        total: 36,
        percentage: 86,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Comfortable margin (86%)',
        minRequiredPercentage: 75,
        placeId: 'bsh-block',
        locationName: 'BS&H Block (Room BSH-02)',
        history: [
          { id: 'hc1', date: '04 Oct 2026', status: 'present', sessionName: 'Lecture 36' },
          { id: 'hc2', date: '02 Oct 2026', status: 'present', sessionName: 'Lecture 35' },
          { id: 'hc3', date: '30 Sep 2026', status: 'absent', sessionName: 'Lecture 34' },
          { id: 'hc4', date: '27 Sep 2026', status: 'present', sessionName: 'Lecture 33' },
        ],
      },
      {
        id: 'sub-be',
        subjectId: 'sub-be',
        code: '24EE101',
        name: 'Basic Electrical Engineering',
        subjectName: 'Basic Electrical Engineering',
        faculty: 'Dr. P. Govinda Rao',
        attended: 25,
        total: 29,
        percentage: 86,
        threshold: 75,
        status: 'healthy',
        statusLabel: 'Consistent (86%)',
        minRequiredPercentage: 75,
        placeId: 'eee-block',
        locationName: 'EEE Block (Room E-12)',
        history: [
          { id: 'hd1', date: '03 Oct 2026', status: 'present', sessionName: 'Lecture 29' },
          { id: 'hd2', date: '01 Oct 2026', status: 'present', sessionName: 'Lecture 28' },
          { id: 'hd3', date: '28 Sep 2026', status: 'absent', sessionName: 'Lecture 27' },
          { id: 'hd4', date: '26 Sep 2026', status: 'present', sessionName: 'Lecture 26' },
        ],
      },
    ],
  },
};
