import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  ChevronRight, 
  Map as MapIcon, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  History, 
  User, 
  X,
  Building,
  GraduationCap
} from 'lucide-react';
import { StudentProfile } from '../../data/student';
import { AttendanceRecord } from '../../data/attendance';
import { DaySchedule, TimetableSlot } from '../../data/timetable';
import { ExamItem } from '../../data/exams';
import { mvgrAssets } from '../../assets/mvgrAssets';
import { CAMPUS_PLACES } from '../../data/campusPlaces';
import { recentPlacesService } from '../../services/recentPlacesService';
import { timetableService, NextClassResult } from '../../services/timetableService';

interface HomeScreenProps {
  student: StudentProfile;
  attendance: AttendanceRecord;
  todaySchedule: DaySchedule | undefined;
  upcomingExams: ExamItem[];
  onNavigateToTab: (
    tab: 'home' | 'map' | 'academics' | 'profile', 
    subTab?: 'attendance' | 'timetable' | 'exams'
  ) => void;
  onNavigateToPlaceOnMap: (placeId: string) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

// Helper for ordinal suffix (e.g. 6th, 1st, 2nd)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  student,
  attendance,
  todaySchedule,
  upcomingExams,
  onNavigateToTab,
  onNavigateToPlaceOnMap,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<TimetableSlot | null>(null);
  const [recentPlaceIds, setRecentPlaceIds] = useState<string[]>([]);

  // Load recent map interactions
  useEffect(() => {
    setRecentPlaceIds(recentPlacesService.getRecentPlaceIds());
  }, []);

  // Compute Greeting (Morning, Afternoon, Evening) based on local time
  const currentHour = new Date().getHours();
  const greeting = useMemo(() => {
    if (currentHour >= 5 && currentHour < 12) return 'Good morning';
    if (currentHour >= 12 && currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  }, [currentHour]);

  const firstName = student.name.split(' ')[0];
  const semesterOrdinal = `${student.semester}${getOrdinalSuffix(student.semester)} Semester`;

  const todayFormattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }, []);

  // Delegate next/current class calculation to reusable timetableService
  const nextClassInfo: NextClassResult = useMemo(() => {
    return timetableService.getNextClass(todaySchedule);
  }, [todaySchedule]);

  // Attendance Metrics
  const healthySubjectsCount = useMemo(() => {
    return attendance.subjects.filter((s) => s.percentage >= 75).length;
  }, [attendance.subjects]);

  const attentionSubjectsCount = useMemo(() => {
    return attendance.subjects.filter((s) => s.percentage < 75).length;
  }, [attendance.subjects]);

  // Nearest Upcoming Exam
  const nextExam = upcomingExams[0];

  // Map recent IDs to verified campus places
  const recentPlaces = useMemo(() => {
    return recentPlaceIds
      .map((id) => CAMPUS_PLACES.find((p) => p.id === id))
      .filter((p): p is typeof CAMPUS_PLACES[0] => Boolean(p))
      .slice(0, 3);
  }, [recentPlaceIds]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20 select-none">
      {/* 1. HEADER / GREETING */}
      <header className="bg-slate-900 text-white px-5 pt-4 pb-5 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <img 
              src={mvgrAssets.crestSvg} 
              alt="MVGR Autonomous Crest" 
              className="w-5 h-5 rounded-full" 
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold tracking-wider text-amber-400">MVGR</span>
              <span className="text-[11px] text-slate-300 font-medium">Campus Companion</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>

            <button
              onClick={() => onNavigateToTab('profile')}
              className="w-8 h-8 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700 font-bold text-xs flex items-center justify-center transition-colors"
              title="Open Student Profile"
            >
              {student.name.split(' ').map((n) => n[0]).join('')}
            </button>
          </div>
        </div>

        {/* Dynamic Context & Personalized Identity */}
        <div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            {todayFormattedDate} • Autonomous Campus
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            {student.department} • {semesterOrdinal}
          </p>
        </div>
      </header>

      {/* MAIN DASHBOARD BODY */}
      <div className="p-4 space-y-3.5 max-w-lg mx-auto">
        {/* 2. NEXT CLASS / CURRENT CLASS / NO CLASS STATE */}
        <section aria-labelledby="class-status-title">
          {nextClassInfo.status === 'current' && nextClassInfo.entry && (
            <div className="bg-white border-2 border-emerald-600/30 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span id="class-status-title" className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  Current Class
                </span>
                <span className="text-xs font-semibold text-emerald-900 font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {nextClassInfo.displayText}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                {nextClassInfo.entry.subject}
              </h2>

              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {nextClassInfo.entry.startTime} – {nextClassInfo.entry.endTime}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="font-medium text-slate-800">
                    {nextClassInfo.entry.location || `${nextClassInfo.entry.building} • ${nextClassInfo.entry.room}`}
                  </span>
                </div>
                {nextClassInfo.entry.faculty && (
                  <span className="text-[11px] text-slate-500">{nextClassInfo.entry.faculty}</span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedSlotDetails(nextClassInfo.entry)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  VIEW DETAILS
                </button>

                <button
                  onClick={() => {
                    const target = nextClassInfo.entry?.locationId || nextClassInfo.entry?.placeId;
                    if (target) {
                      onNavigateToPlaceOnMap(target);
                    } else {
                      onNavigateToTab('map');
                    }
                  }}
                  className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white" />
                  <span>VIEW LOCATION</span>
                </button>
              </div>
            </div>
          )}

          {nextClassInfo.status === 'next' && nextClassInfo.entry && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span id="class-status-title" className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Next Class
                </span>
                <span className="text-xs font-semibold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {nextClassInfo.displayText}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                {nextClassInfo.entry.subject}
              </h2>

              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {nextClassInfo.entry.startTime} – {nextClassInfo.entry.endTime}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="font-medium text-slate-800">
                    {nextClassInfo.entry.location || `${nextClassInfo.entry.building} • ${nextClassInfo.entry.room}`}
                  </span>
                </div>
                {nextClassInfo.entry.faculty && (
                  <span className="text-[11px] text-slate-500">{nextClassInfo.entry.faculty}</span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedSlotDetails(nextClassInfo.entry)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  VIEW DETAILS
                </button>

                <button
                  onClick={() => {
                    const target = nextClassInfo.entry?.locationId || nextClassInfo.entry?.placeId;
                    if (target) {
                      onNavigateToPlaceOnMap(target);
                    } else {
                      onNavigateToTab('map');
                    }
                  }}
                  className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white" />
                  <span>VIEW ON MAP</span>
                </button>
              </div>
            </div>
          )}

          {(nextClassInfo.status === 'done' || nextClassInfo.status === 'none') && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span id="class-status-title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Today&apos;s Classes
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {nextClassInfo.status === 'done' ? 'Completed' : 'Schedule'}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {nextClassInfo.displayText}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {nextExam 
                  ? `Next academic event: ${nextExam.subject} on ${nextExam.date}.`
                  : 'Check your weekly timetable or review upcoming examination dates.'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigateToTab('academics', 'timetable')}
                  className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <span>VIEW TIMETABLE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3. ATTENDANCE OVERVIEW */}
        <section aria-labelledby="attendance-summary-title">
          <div 
            onClick={() => onNavigateToTab('academics', 'attendance')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span id="attendance-summary-title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Attendance
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                attendance.overallPercentage >= 75
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}>
                Min. 75% Requirement
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
                  {attendance.overallPercentage}%
                </span>
                <span className="text-xs text-slate-500 ml-2 font-medium">Overall</span>
              </div>

              <button
                onClick={() => onNavigateToTab('academics', 'attendance')}
                className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
              >
                <span>VIEW ATTENDANCE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact Status Breakdown */}
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>{healthySubjectsCount}</strong> healthy subjects
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700">
                <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${
                  attentionSubjectsCount > 0 ? 'text-amber-600' : 'text-slate-400'
                }`} />
                <span>
                  {attentionSubjectsCount > 0 ? (
                    <span className="text-amber-800 font-medium">
                      <strong>{attentionSubjectsCount}</strong> needs attention
                    </span>
                  ) : (
                    <span>All subjects safe</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. UPCOMING EXAM */}
        {nextExam && (
          <section aria-labelledby="upcoming-exam-title">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span id="upcoming-exam-title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Upcoming Exam
                </span>
                <span className="text-[11px] font-semibold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {nextExam.date}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {nextExam.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {nextExam.time} {nextExam.location ? `• ${nextExam.location}` : ''}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateToTab('academics', 'exams')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>VIEW EXAMS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {nextExam.placeId && (
                  <button
                    onClick={() => onNavigateToPlaceOnMap(nextExam.placeId!)}
                    className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg border border-blue-200 text-xs transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-blue-700" />
                    <span>VIEW LOCATION</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 5. QUICK ACTIONS */}
        <section aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-0.5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onNavigateToTab('map')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">MAP</span>
            </button>

            <button
              onClick={() => onNavigateToTab('academics', 'attendance')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">ATTENDANCE</span>
            </button>

            <button
              onClick={() => onNavigateToTab('academics', 'timetable')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">TIMETABLE</span>
            </button>

            <button
              onClick={() => onNavigateToTab('academics', 'exams')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl shadow-xs text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">EXAMS</span>
            </button>
          </div>
        </section>

        {/* 6. RECENT ACTIVITY (Real Map Interactions) */}
        {recentPlaces.length > 0 && (
          <section aria-labelledby="recent-places-title">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <h2 id="recent-places-title" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recent Locations
              </h2>
              <span className="text-[10px] text-slate-400">Map history</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-xs overflow-hidden">
              {recentPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => onNavigateToPlaceOnMap(place.id)}
                  className="w-full p-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-950 transition-colors">
                        {place.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {place.category} {place.building ? `• ${place.building}` : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 7. PROGRESSIVE DISCLOSURE: SLOT DETAILS MODAL */}
      {selectedSlotDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3 shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                  {selectedSlotDetails.code || 'Course Slot'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedSlotDetails.subject}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSlotDetails(null)} 
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Timing:</strong> {selectedSlotDetails.startTime} – {selectedSlotDetails.endTime}</span>
              </div>

              {selectedSlotDetails.faculty && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>Faculty:</strong> {selectedSlotDetails.faculty}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Venue:</strong> {selectedSlotDetails.location}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedSlotDetails(null)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex-1"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const pid = selectedSlotDetails.placeId;
                  setSelectedSlotDetails(null);
                  if (pid) {
                    onNavigateToPlaceOnMap(pid);
                  } else {
                    onNavigateToTab('map');
                  }
                }}
                className="py-2 px-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors flex-1 flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>Locate on Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
