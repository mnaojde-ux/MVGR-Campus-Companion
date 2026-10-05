export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  program: string;
  department: string;
  year: string;
  semester: number;
  section: string;
  email: string;
  phone: string;
  advisor: string;
  avatarUrl?: string;
  isFirstYearPersona?: boolean;
}

export const MOCK_STUDENTS: Record<string, StudentProfile> = {
  manoj: {
    id: 'manoj',
    name: 'Manoj Kumar',
    rollNo: '22331A0589',
    program: 'B.Tech in Computer Science and Engineering',
    department: 'CSE — Data Engineering',
    year: '3rd Year',
    semester: 6,
    section: 'B',
    email: 'manoj.kumar@mvgrce.edu.in',
    phone: '+91 98765 43210',
    advisor: 'Dr. P. Satyanarayana (Senior Professor, CSE)',
    isFirstYearPersona: false,
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun Verma',
    rollNo: '24331A0512',
    program: 'B.Tech in Computer Science and Engineering',
    department: 'CSE (First Year Orientation)',
    year: '1st Year',
    semester: 1,
    section: 'A',
    email: 'arjun.verma@mvgrce.edu.in',
    phone: '+91 94401 23456',
    advisor: 'Dr. K. Srinivas (BS&H First-Year Coordinator)',
    isFirstYearPersona: true,
  },
};

export const DEFAULT_STUDENT_ID = 'manoj';
