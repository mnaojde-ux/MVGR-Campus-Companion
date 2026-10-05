export interface ExamItem {
  id: string;
  subject: string;
  code: string;
  examType: string; // e.g. "Mid-Term Examination II", "Semester End Practical"
  date: string;     // e.g. "12 Oct 2026"
  time: string;     // e.g. "10:00 AM – 12:00 PM"
  location: string;
  placeId?: string; // links to campus place!
  hallNo?: string;
  seatRange?: string;
  syllabusHighlights?: string;
  daysRemaining?: number;
}

export interface PastExamItem {
  id: string;
  subject: string;
  code: string;
  semester: string;
  grade: string;
  credits: number;
  monthYear: string;
}

export const MOCK_UPCOMING_EXAMS: Record<string, ExamItem[]> = {
  manoj: [
    {
      id: 'ex-dbms',
      subject: 'Database Management Systems',
      code: '20CS603',
      examType: 'Mid-Term Examination II',
      date: '12 Oct 2026',
      time: '10:00 AM – 12:00 PM',
      location: 'CSE Block (Examination Hall 102)',
      placeId: 'cse-block',
      hallNo: 'Room 102, Ground Floor',
      seatRange: 'Roll No: 22331A0560 to 22331A0595',
      syllabusHighlights: 'Units 3 & 4: Relational Algebra, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control.',
      daysRemaining: 7,
    },
    {
      id: 'ex-ml',
      subject: 'Machine Learning',
      code: '20CS601',
      examType: 'Mid-Term Examination II',
      date: '16 Oct 2026',
      time: '02:00 PM – 04:00 PM',
      location: 'CSE Block (Examination Hall 204)',
      placeId: 'cse-block',
      hallNo: 'Room 204, 1st Floor',
      seatRange: 'Roll No: 22331A0570 to 22331A0599',
      syllabusHighlights: 'Units 3 & 4: Decision Trees, SVM, Neural Networks Basics, Clustering Algorithms (K-Means, Hierarchical).',
      daysRemaining: 11,
    },
    {
      id: 'ex-del-lab',
      subject: 'Digital Engineering Lab (Practical Exam)',
      code: '20CS605',
      examType: 'Autonomous Lab External Assessment',
      date: '24 Oct 2026',
      time: '09:30 AM – 12:30 PM',
      location: 'Digital Engineering Lab (Lab 3)',
      placeId: 'del-lab',
      hallNo: 'Systems Lab 3',
      seatRange: 'Batch B1',
      syllabusHighlights: 'Full Stack Integration, Cloud Deployment, and Data Pipeline Testing.',
      daysRemaining: 19,
    },
  ],
  arjun: [
    {
      id: 'ex-phy',
      subject: 'Engineering Physics',
      code: '24BS101',
      examType: 'Mid-Term Examination I',
      date: '14 Oct 2026',
      time: '10:00 AM – 12:00 PM',
      location: 'BS&H Block (Room BSH-04)',
      placeId: 'bsh-block',
      hallNo: 'BSH-04, Ground Floor',
      seatRange: 'Roll No: 24331A0501 to 24331A0540',
      syllabusHighlights: 'Wave Optics, Lasers and Optical Fibers, Quantum Mechanics.',
      daysRemaining: 9,
    },
    {
      id: 'ex-math',
      subject: 'Linear Algebra & Calculus',
      code: '24MA101',
      examType: 'Mid-Term Examination I',
      date: '18 Oct 2026',
      time: '10:00 AM – 12:00 PM',
      location: 'BS&H Block (Room BSH-02)',
      placeId: 'bsh-block',
      hallNo: 'BSH-02, Ground Floor',
      seatRange: 'Roll No: 24331A0501 to 24331A0540',
      syllabusHighlights: 'Matrices, Eigenvalues, Mean Value Theorems, Multiple Integrals.',
      daysRemaining: 13,
    },
  ],
};

export const MOCK_PAST_EXAMS: Record<string, PastExamItem[]> = {
  manoj: [
    {
      id: 'past-1',
      subject: 'Design & Analysis of Algorithms',
      code: '20CS501',
      semester: 'Semester V',
      grade: 'A+ (9.0)',
      credits: 4,
      monthYear: 'Apr 2026',
    },
    {
      id: 'past-2',
      subject: 'Computer Networks',
      code: '20CS502',
      semester: 'Semester V',
      grade: 'A (8.0)',
      credits: 3,
      monthYear: 'Apr 2026',
    },
    {
      id: 'past-3',
      subject: 'Operating Systems',
      code: '20CS401',
      semester: 'Semester IV',
      grade: 'O (10.0)',
      credits: 4,
      monthYear: 'Nov 2025',
    },
    {
      id: 'past-4',
      subject: 'Software Engineering',
      code: '20CS402',
      semester: 'Semester IV',
      grade: 'A+ (9.0)',
      credits: 3,
      monthYear: 'Nov 2025',
    },
  ],
  arjun: [],
};
