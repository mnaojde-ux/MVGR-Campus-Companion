import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Navigation, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Coffee, 
  Sparkles, 
  X,
  Building,
  GraduationCap
} from 'lucide-react';
import { DaySchedule, TimetableEntry } from '../../data/timetable';
import { timetableService, NextClassResult } from '../../services/timetableService';

interface TimetableViewProps {
  timetable: DaySchedule[];
  onNavigateToPlaceOnMap: (placeId: string) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable,
  onNavigateToPlaceOnMap,
}) => {
  // Views: TODAY (default) vs WEEK
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

  // Selected day for WEEK view (defaults to today's day name or Monday)
  const todayDaySchedule = useMemo(() => {
    return timetable.find((d) => d.isToday) || timetable[0];
  }, [timetable]);

  const [selectedWeekDay, setSelectedWeekDay] = useState<string>(
    todayDaySchedule?.dayName || 'Monday'
  );

  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState<TimetableEntry | null>(null);

  // Active schedule being rendered
  const activeDaySchedule = useMemo(() => {
    if (viewMode === 'today') {
      return todayDaySchedule;
    }
    return timetable.find((d) => d.dayName === selectedWeekDay) || todayDaySchedule;
  }, [viewMode, todayDaySchedule, timetable, selectedWeekDay]);

  // Compute live current / next class status using reusable timetableService engine
  const nextClassInfo: NextClassResult = useMemo(() => {
    return timetableService.getNextClass(timetable);
  }, [timetable]);

  // Helper to determine slot state in today's view
  const getSlotState = (slot: TimetableEntry) => {
    if (slot.type === 'break') return 'break';
    if (nextClassInfo.status === 'current' && nextClassInfo.entry?.id === slot.id) {
      return 'current';
    }
    if (nextClassInfo.status === 'next' && nextClassInfo.entry?.id === slot.id) {
      return 'next';
    }
    return 'normal';
  };

  const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-3.5 select-none">
      {/* 1. VIEW SWITCHER (TODAY vs WEEK) */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Academic Schedule
          </span>
          <span className="text-xs text-slate-600 font-medium">
            {viewMode === 'today' ? `${todayDaySchedule?.dayName} (Today)` : `${selectedWeekDay} Schedule`}
          </span>
        </div>

        <div className="flex bg-slate-200/90 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setViewMode('today')}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === 'today'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TODAY
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === 'week'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            WEEK
          </button>
        </div>
      </div>

      {/* 2. WEEK DAY SELECTOR PILLS (Rendered in WEEK mode) */}
      {viewMode === 'week' && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {dayList.map((dayName) => {
            const isDayToday = todayDaySchedule?.dayName === dayName;
            const isSelected = selectedWeekDay === dayName;
            return (
              <button
                key={dayName}
                onClick={() => setSelectedWeekDay(dayName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{dayName.slice(0, 3)}</span>
                {isDayToday && (
                  <span className={`ml-1 text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-blue-900'
                  }`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. CURRENT / NEXT CLASS INTELLIGENCE BANNER (TODAY MODE) */}
      {viewMode === 'today' && (
        <>
          {nextClassInfo.status === 'current' && nextClassInfo.entry && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Now in Session • {nextClassInfo.displayText}
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {nextClassInfo.entry.subject}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {nextClassInfo.entry.room} • {nextClassInfo.entry.building}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const target = nextClassInfo.entry?.locationId || nextClassInfo.entry?.placeId;
                  if (target) onNavigateToPlaceOnMap(target);
                }}
                className="py-1.5 px-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Navigation className="w-3 h-3 fill-white" />
                <span>Locate</span>
              </button>
            </div>
          )}

          {nextClassInfo.status === 'next' && nextClassInfo.entry && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                    Next Up • {nextClassInfo.displayText}
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {nextClassInfo.entry.subject}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {nextClassInfo.entry.room} • {nextClassInfo.entry.building}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const target = nextClassInfo.entry?.locationId || nextClassInfo.entry?.placeId;
                  if (target) onNavigateToPlaceOnMap(target);
                }}
                className="py-1.5 px-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Navigation className="w-3 h-3 fill-white" />
                <span>Map</span>
              </button>
            </div>
          )}

          {nextClassInfo.status === 'done' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-600 shadow-xs">
              <p className="font-semibold text-slate-800">You&apos;re done with today&apos;s lectures.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Check tomorrow&apos;s classes or review upcoming examinations.</p>
            </div>
          )}
        </>
      )}

      {/* 4. VERTICAL TIMELINE VIEW */}
      {!activeDaySchedule || !activeDaySchedule.slots || activeDaySchedule.slots.length === 0 ? (
        /* NO CLASS CLEAN STATE */
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No classes scheduled.</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            There are no lectures or practical sessions scheduled for {viewMode === 'today' ? 'today' : selectedWeekDay}.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {activeDaySchedule.slots.map((slot) => {
            const state = getSlotState(slot);
            const isBreak = slot.type === 'break';

            // Distinct node styling on timeline track
            const getNodeBadge = () => {
              if (state === 'current') return 'bg-emerald-600 ring-4 ring-emerald-100';
              if (state === 'next') return 'bg-blue-900 ring-4 ring-blue-100';
              if (isBreak) return 'bg-slate-300';
              return 'bg-slate-400';
            };

            // Break entries: clean, subtle horizontal pill
            if (isBreak) {
              return (
                <div key={slot.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className={`absolute -left-6 top-3 w-2.5 h-2.5 rounded-full border-2 border-white -translate-x-1/2 ${getNodeBadge()}`} />

                  <div className="bg-slate-100/90 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-800">{slot.subject}</span>
                      <span className="text-[10px] text-slate-400">• {slot.location}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                </div>
              );
            }

            // Academic Lecture / Lab / Tutorial Card
            return (
              <div key={slot.id} className="relative group">
                {/* Timeline bullet dot */}
                <div className={`absolute -left-6 top-4 w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 transition-transform ${getNodeBadge()}`} />

                <div 
                  onClick={() => setSelectedEntryForDetails(slot)}
                  className={`bg-white rounded-xl p-3.5 transition-all cursor-pointer shadow-xs border ${
                    state === 'current'
                      ? 'border-2 border-emerald-600/40 bg-emerald-50/20'
                      : state === 'next'
                      ? 'border-2 border-blue-900/30 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Header Row: Time and Status Flag */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      {slot.code && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {slot.code}
                        </span>
                      )}
                    </div>

                    {state === 'current' && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        Current
                      </span>
                    )}

                    {state === 'next' && (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        Next
                      </span>
                    )}

                    {state === 'normal' && slot.type && (
                      <span className="text-[10px] font-medium text-slate-500 capitalize">
                        {slot.type}
                      </span>
                    )}
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {slot.subject}
                  </h3>

                  {/* Faculty & Venue Information */}
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {slot.building || 'Campus'} {slot.room ? `• ${slot.room}` : ''}
                      </span>
                    </div>

                    {slot.faculty && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{slot.faculty}</span>
                      </div>
                    )}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">Tap for details</span>

                    {(slot.locationId || slot.placeId) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const target = slot.locationId || slot.placeId;
                          if (target) onNavigateToPlaceOnMap(target);
                        }}
                        className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Navigation className="w-3 h-3 fill-blue-900" />
                        <span>VIEW ON MAP</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. CLASS DETAIL MODAL */}
      {selectedEntryForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3.5 shadow-2xl border border-slate-200 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider font-mono">
                    {selectedEntryForDetails.code || selectedEntryForDetails.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 capitalize">
                    {selectedEntryForDetails.type} session
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedEntryForDetails.subject}
                </h3>
              </div>

              <button 
                onClick={() => setSelectedEntryForDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">Timing: </span>
                  <span className="font-mono">{selectedEntryForDetails.startTime} – {selectedEntryForDetails.endTime}</span>
                  <span className="text-slate-400 ml-1">({selectedEntryForDetails.day})</span>
                </div>
              </div>

              {selectedEntryForDetails.faculty && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Faculty: </span>
                    <span>{selectedEntryForDetails.faculty}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Campus Venue: </span>
                  <p className="text-slate-700 font-medium">{selectedEntryForDetails.building}</p>
                  <p className="text-[11px] text-slate-500">{selectedEntryForDetails.room}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedEntryForDetails(null)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex-1"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const target = selectedEntryForDetails.locationId || selectedEntryForDetails.placeId;
                  setSelectedEntryForDetails(null);
                  if (target) {
                    onNavigateToPlaceOnMap(target);
                  }
                }}
                className="py-2.5 px-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors flex-1 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 fill-white" />
                <span>VIEW ON MAP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
