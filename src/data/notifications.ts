export interface CampusNotification {
  id: string;
  title: string;
  category: 'Exam' | 'Academic' | 'Campus' | 'Attendance';
  timestamp: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  placeId?: string;
}

export const MOCK_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'n1',
    title: 'Mid-Term II Examination Hall Allocation',
    category: 'Exam',
    timestamp: '2 hours ago',
    message: 'Seating arrangements for Database Management Systems (12 Oct) are released. Check room 102 in CSE Block.',
    read: false,
    placeId: 'cse-block',
  },
  {
    id: 'n2',
    title: 'Autonomous Attendance Threshold Alert',
    category: 'Attendance',
    timestamp: 'Yesterday',
    message: 'Your attendance in Database Management Systems is currently at 76%. Maintain regular attendance to stay above the 75% cutoff.',
    read: false,
  },
  {
    id: 'n3',
    title: 'First-Year Orientation Tour Reminder',
    category: 'Campus',
    timestamp: '2 days ago',
    message: 'Campus navigation maps updated with all departmental blocks and lab buildings. Use Campus Companion to locate your classes.',
    read: true,
    placeId: 'bsh-block',
  },
  {
    id: 'n4',
    title: 'Central Library Extended Study Hours',
    category: 'Academic',
    timestamp: '3 days ago',
    message: 'Dr. P.V.G. Raju Central Library will remain open until 8:00 PM for the upcoming exam cycle.',
    read: true,
    placeId: 'central-library',
  },
];
