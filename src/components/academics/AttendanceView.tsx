import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  SlidersHorizontal,
  Info,
  Check,
  X as XIcon,
  HelpCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AttendanceRecord, SubjectAttendance } from '../../data/attendance';
import { attendanceService } from '../../services/attendanceService';

interface AttendanceViewProps {
  attendance: AttendanceRecord | null;
  isLoading?: boolean;
  isError?: boolean;
  onNavigateToPlaceOnMap: (placeId: string) => void;
  onRetry?: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  isLoading = false,
  isError = false,
  onNavigateToPlaceOnMap,
  onRetry,
}) => {
  // Configurable threshold: Default 75% (JNTU-GV Standard), with 80% or 65% options
  const [configurableThreshold, setConfigurableThreshold] = useState<number>(75);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'healthy' | 'attention' | 'critical'>('all');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [showThresholdPicker, setShowThresholdPicker] = useState<boolean>(false);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="bg-white border border-slate-200 rounded-xl p-4 h-36" />
        <div className="space-y-2">
          <div className="h-16 bg-white border border-slate-200 rounded-xl" />
          <div className="h-16 bg-white border border-slate-200 rounded-xl" />
          <div className="h-16 bg-white border border-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error or Unavailable State
  if (isError || !attendance) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Attendance Data Unavailable</h3>
          <p className="text-xs text-slate-500 mt-1">
            Unable to fetch official attendance records at this moment.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="py-2 px-4 bg-blue-900 text-white font-bold text-xs rounded-lg hover:bg-blue-800 transition-colors"
          >
            Retry Loading
          </button>
        )}
      </div>
    );
  }

  // Handle empty subjects case
  if (!attendance.subjects || attendance.subjects.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-2">
        <Info className="w-6 h-6 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">No Attendance Records Found</h3>
        <p className="text-xs text-slate-500">
          Your course registrations have not yet recorded attendance for this term.
        </p>
      </div>
    );
  }

  // Calculate subject statuses based on active configurable threshold
  const subjectsWithComputedStatus = useMemo(() => {
    return attendance.subjects.map((sub) => {
      const insight = attendanceService.calculateAttendanceInsight(
        sub.attended,
        sub.total,
        configurableThreshold
      );
      return {
        ...sub,
        computedStatus: insight.status,
        insight,
      };
    });
  }, [attendance.subjects, configurableThreshold]);

  // Aggregate stats
  const healthyCount = subjectsWithComputedStatus.filter((s) => s.computedStatus === 'healthy').length;
  const attentionCount = subjectsWithComputedStatus.filter((s) => s.computedStatus === 'attention').length;
  const criticalCount = subjectsWithComputedStatus.filter((s) => s.computedStatus === 'critical').length;

  // Filtered list based on active filter pill
  const filteredSubjects = useMemo(() => {
    if (selectedFilter === 'all') return subjectsWithComputedStatus;
    return subjectsWithComputedStatus.filter((s) => s.computedStatus === selectedFilter);
  }, [subjectsWithComputedStatus, selectedFilter]);

  return (
    <div className="space-y-3.5 select-none">
      {/* 1. TOP OVERVIEW CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Attendance Overview
          </span>
          <button
            onClick={() => setShowThresholdPicker(!showThresholdPicker)}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
            title="Configure Target Threshold"
          >
            <SlidersHorizontal className="w-3 h-3 text-blue-800" />
            <span>Target: {configurableThreshold}%</span>
          </button>
        </div>

        {/* Configurable Threshold Selector Dropdown */}
        {showThresholdPicker && (
          <div className="mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs animate-in fade-in">
            <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800 text-[11px]">
              <span>Select Evaluation Threshold:</span>
              <button 
                onClick={() => setShowThresholdPicker(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Done
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '75% (Official)', value: 75, desc: 'JNTU-GV Autonomous Standard' },
                { label: '80% (Safe Buffer)', value: 80, desc: 'Recommended Safety Target' },
                { label: '65% (Condonation)', value: 65, desc: 'Medical Condonation Limit' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setConfigurableThreshold(opt.value);
                    setShowThresholdPicker(false);
                  }}
                  className={`p-1.5 rounded-md text-left transition-all border ${
                    configurableThreshold === opt.value
                      ? 'bg-blue-900 text-white border-blue-900 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-[11px] leading-tight">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overall Percentage Display */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {attendance.overallPercentage}%
            </span>
            <span className="text-xs text-slate-500 ml-2 font-medium">Overall aggregate</span>
          </div>

          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
            attendance.overallPercentage >= configurableThreshold
              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
              : 'text-amber-800 bg-amber-50 border-amber-200'
          }`}>
            {attendance.overallPercentage >= configurableThreshold ? 'Target Met' : 'Below Target'}
          </span>
        </div>

        {/* Clean Linear Progress Bar with Threshold Indicator */}
        <div className="mt-3">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                attendance.overallPercentage >= configurableThreshold
                  ? 'bg-blue-900'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${Math.min(attendance.overallPercentage, 100)}%` }}
            />
            {/* Cutoff line indicator */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10" 
              style={{ left: `${configurableThreshold}%` }} 
              title={`${configurableThreshold}% Cutoff`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
            <span>0%</span>
            <span className="text-red-700 font-semibold">{configurableThreshold}% Cutoff</span>
            <span>100%</span>
          </div>
        </div>

        {/* Classes Attended vs Missed Summary Grid */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Classes Attended
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {attendance.totalAttended} <span className="text-xs text-slate-400 font-normal">/ {attendance.totalConducted}</span>
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Classes Missed
            </span>
            <span className="text-base font-bold text-amber-800 font-mono mt-0.5 block">
              {attendance.totalMissed} <span className="text-xs text-slate-400 font-normal">absences</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. FILTER PILLS */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Courses ({subjectsWithComputedStatus.length})
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({subjectsWithComputedStatus.length})
          </button>

          <button
            onClick={() => setSelectedFilter('healthy')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
              selectedFilter === 'healthy'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Healthy ({healthyCount})
          </button>

          <button
            onClick={() => setSelectedFilter('attention')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
              selectedFilter === 'attention'
                ? 'bg-amber-800 text-white border-amber-800'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Attention ({attentionCount})
          </button>

          {criticalCount > 0 && (
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border ${
                selectedFilter === 'critical'
                  ? 'bg-rose-800 text-white border-rose-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              Critical ({criticalCount})
            </button>
          )}
        </div>
      </div>

      {/* 3. SUBJECTS LIST */}
      <div className="space-y-2">
        {filteredSubjects.length === 0 ? (
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No subjects matching &ldquo;{selectedFilter}&rdquo; filter.
          </div>
        ) : (
          filteredSubjects.map((sub) => {
            const isExpanded = expandedSubjectId === sub.id;

            // Restrained status badge configuration
            const getStatusBadge = () => {
              if (sub.computedStatus === 'healthy') {
                return {
                  label: 'Healthy',
                  bg: 'bg-emerald-50',
                  text: 'text-emerald-800',
                  border: 'border-emerald-200',
                };
              }
              if (sub.computedStatus === 'attention') {
                return {
                  label: 'Attention',
                  bg: 'bg-amber-50',
                  text: 'text-amber-800',
                  border: 'border-amber-200',
                };
              }
              return {
                label: 'Critical',
                bg: 'bg-rose-50',
                text: 'text-rose-800',
                border: 'border-rose-200',
              };
            };

            const statusBadge = getStatusBadge();

            return (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Header clickable row */}
                <button
                  onClick={() => setExpandedSubjectId(isExpanded ? null : sub.id)}
                  className="w-full p-3.5 text-left hover:bg-slate-50/80 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {sub.subjectName || sub.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {sub.code} • {sub.faculty}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {sub.percentage}%
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {sub.attended} / {sub.total}
                      </p>
                    </div>
                  </div>

                  {/* Clean linear progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sub.computedStatus === 'healthy'
                          ? 'bg-blue-900'
                          : sub.computedStatus === 'attention'
                          ? 'bg-amber-600'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>

                  {/* Small chevron hint */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Tap for insights & session history</span>
                    <div className="flex items-center gap-0.5 text-blue-900 font-semibold">
                      <span>{isExpanded ? 'Less' : 'Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </button>

                {/* EXPANDED SUBJECT DETAIL & INSIGHTS */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 bg-slate-50/70 text-xs space-y-3">
                    {/* 1. Quick Stats Grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Attended</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{sub.attended}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Missed</span>
                        <span className="font-bold text-amber-700 font-mono text-xs">{sub.total - sub.attended}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Total</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{sub.total}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Cutoff</span>
                        <span className="font-bold text-slate-800 font-mono text-xs">{configurableThreshold}%</span>
                      </div>
                    </div>

                    {/* 2. ATTENDANCE INSIGHTS CALCULATION */}
                    <div className="p-2.5 bg-white rounded-lg border border-blue-100 shadow-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-950 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                        <span>Attendance Intelligence</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {sub.insight.summaryMessage}
                      </p>
                      <p className="text-[11px] text-blue-900 font-semibold leading-snug pt-0.5">
                        {sub.insight.detailedInsight}
                      </p>
                    </div>

                    {/* 3. ATTENDANCE SESSION HISTORY */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Recent Session Log
                      </span>

                      {sub.history && sub.history.length > 0 ? (
                        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                          {sub.history.map((entry) => (
                            <div
                              key={entry.id}
                              className="px-3 py-2 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  entry.status === 'present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : entry.status === 'absent'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {entry.status === 'present' ? '✓' : entry.status === 'absent' ? '✕' : '–'}
                                </span>
                                <div>
                                  <span className="font-semibold text-slate-800">{entry.date}</span>
                                  {entry.sessionName && (
                                    <span className="text-[10px] text-slate-400 ml-1.5">
                                      • {entry.sessionName}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {entry.time && (
                                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                                    {entry.time}
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  entry.status === 'present'
                                    ? 'text-emerald-700'
                                    : entry.status === 'absent'
                                    ? 'text-rose-700'
                                    : 'text-slate-500'
                                }`}>
                                  {entry.status === 'present' ? 'Present' : entry.status === 'absent' ? 'Absent' : 'Excused'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic p-2 bg-white rounded border border-slate-200">
                          Detailed session-by-session history is not available for this course yet.
                        </p>
                      )}
                    </div>

                    {/* 4. Classroom Navigation Link */}
                    {sub.placeId && (
                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">{sub.locationName}</span>
                        <button
                          onClick={() => onNavigateToPlaceOnMap(sub.placeId)}
                          className="text-xs font-bold text-blue-900 hover:text-blue-800 flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-800" />
                          <span>View Classroom on Map</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
