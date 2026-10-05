import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  ChevronRight,
  ChevronDown,
  Layers,
  FileText
} from 'lucide-react';
import { AttendanceRecord, SubjectAttendance } from '../../data/attendance';
import { DaySchedule, TimetableSlot } from '../../data/timetable';
import { ExamItem, PastExamItem } from '../../data/exams';
import { StudentProfile } from '../../data/student';
import { AttendanceView } from './AttendanceView';
import { TimetableView } from './TimetableView';

interface AcademicsScreenProps {
  initialSubTab?: 'attendance' | 'timetable' | 'exams';
  student: StudentProfile;
  attendance: AttendanceRecord;
  timetable: DaySchedule[];
  upcomingExams: ExamItem[];
  pastExams: PastExamItem[];
  onNavigateToPlaceOnMap: (placeId: string) => void;
}

export const AcademicsScreen: React.FC<AcademicsScreenProps> = ({
  initialSubTab = 'timetable',
  student,
  attendance,
  timetable,
  upcomingExams,
  pastExams,
  onNavigateToPlaceOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'attendance' | 'exams'>(initialSubTab);

  // Exams mode: Upcoming vs Past
  const [examsMode, setExamsMode] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      {/* Top Segmented Navigation Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 pt-3.5 pb-2.5 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Academics</h1>
            <p className="text-[11px] text-slate-500">Autonomous Student Curriculum</p>
          </div>
          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Sem {student.semester} • Sec {student.section}
          </span>
        </div>

        {/* The 3 Core Academic Modules */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'timetable'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'exams'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-w-lg mx-auto">
        {/* ============================================================== */}
        {/* 1. TIMETABLE */}
        {/* ============================================================== */}
        {activeTab === 'timetable' && (
          <TimetableView
            timetable={timetable}
            onNavigateToPlaceOnMap={onNavigateToPlaceOnMap}
          />
        )}

        {/* ============================================================== */}
        {/* 2. ATTENDANCE */}
        {/* ============================================================== */}
        {activeTab === 'attendance' && (
          <AttendanceView
            attendance={attendance}
            onNavigateToPlaceOnMap={onNavigateToPlaceOnMap}
          />
        )}

        {/* ============================================================== */}
        {/* 3. EXAMS */}
        {/* ============================================================== */}
        {activeTab === 'exams' && (
          <div className="space-y-3">
            {/* Upcoming vs Past Toggle */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium w-fit">
              <button
                onClick={() => setExamsMode('upcoming')}
                className={`px-3 py-1 rounded-md transition-all ${
                  examsMode === 'upcoming'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Upcoming ({upcomingExams.length})
              </button>
              <button
                onClick={() => setExamsMode('past')}
                className={`px-3 py-1 rounded-md transition-all ${
                  examsMode === 'past'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Past Semester Records
              </button>
            </div>

            {examsMode === 'upcoming' ? (
              <div className="space-y-2.5">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                          {exam.examType}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {exam.subject}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {exam.code}
                        </span>
                      </div>

                      {exam.daysRemaining !== undefined && (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          In {exam.daysRemaining} days
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Date</span>
                        <span className="font-bold text-slate-800 font-mono">{exam.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Time</span>
                        <span className="font-bold text-slate-800 font-mono">{exam.time}</span>
                      </div>
                    </div>

                    {exam.hallNo && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Venue: <strong className="text-slate-800">{exam.hallNo}</strong></span>
                      </div>
                    )}

                    {/* Venue Navigation Link to Campus Map */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 truncate">{exam.location}</span>
                      {exam.placeId && (
                        <button
                          onClick={() => onNavigateToPlaceOnMap(exam.placeId!)}
                          className="py-1 px-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Navigation className="w-3 h-3 fill-white" />
                          <span>VIEW LOCATION</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Past Exam Grades */
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Grade History
                </span>
                <div className="divide-y divide-slate-100">
                  {pastExams.map((past) => (
                    <div key={past.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{past.subject}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {past.code} • {past.semester}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Grade {past.grade}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{past.credits} Credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
