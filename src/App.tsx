/**
 * MVGR Campus Companion
 * Official campus navigation & academic companion for MVGR College of Engineering (Autonomous), Vizianagaram.
 * 
 * Capstone Project: Digital Engineering Lab
 * Primary Persona: Manoj Kumar (3rd Year, CSE - Data Engineering)
 * Evaluation Persona: Arjun Verma (1st Year Fresher)
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MobileShell } from './components/layout/MobileShell';
import { BottomNavigation, NavTab } from './components/layout/BottomNavigation';
import { HomeScreen } from './components/home/HomeScreen';
import { CampusMap } from './components/map/CampusMap';
import { AcademicsScreen } from './components/academics/AcademicsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { SplashScreen } from './components/auth/SplashScreen';
import { NotificationsModal } from './components/common/NotificationsModal';

import { StudentProfile } from './data/student';
import { AttendanceRecord } from './data/attendance';
import { DaySchedule } from './data/timetable';
import { ExamItem, PastExamItem } from './data/exams';
import { MOCK_NOTIFICATIONS, CampusNotification } from './data/notifications';
import { getGoogleMapsApiKey } from './config/mapsConfig';

import { studentService } from './services/studentService';
import { attendanceService } from './services/attendanceService';
import { timetableService } from './services/timetableService';
import { examService } from './services/examService';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return sessionStorage.getItem('mvgr_splash_shown') !== 'true';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mvgr_logged_in') !== 'false';
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem('mvgr_active_student') || 'manoj';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [academicsSubTab, setAcademicsSubTab] = useState<'timetable' | 'attendance' | 'exams'>('timetable');
  const [mapInitialPlaceId, setMapInitialPlaceId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampusNotification[]>(MOCK_NOTIFICATIONS);

  // Async Service State
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [timetable, setTimetable] = useState<DaySchedule[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamItem[]>([]);
  const [pastExams, setPastExams] = useState<PastExamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state to storage
  useEffect(() => {
    localStorage.setItem('mvgr_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('mvgr_active_student', activeStudentId);
  }, [activeStudentId]);

  // Load student data via service abstraction
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [prof, att, sched, upExams, pExams] = await Promise.all([
          studentService.getStudentProfile(activeStudentId),
          attendanceService.getAttendanceRecord(activeStudentId),
          timetableService.getWeeklyTimetable(activeStudentId),
          examService.getUpcomingExams(activeStudentId),
          examService.getPastExamRecords(activeStudentId),
        ]);

        if (isMounted) {
          setStudent(prof);
          setAttendance(att);
          setTimetable(sched);
          setUpcomingExams(upExams);
          setPastExams(pExams);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load student data', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeStudentId]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleSplashComplete = () => {
    sessionStorage.setItem('mvgr_splash_shown', 'true');
    setShowSplash(false);
  };

  const handleLogin = (studentId: string) => {
    setActiveStudentId(studentId);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSwitchStudent = (studentId: string) => {
    setActiveStudentId(studentId);
  };

  const handleNavigateToTab = (
    tab: NavTab,
    subTab?: 'attendance' | 'timetable' | 'exams'
  ) => {
    if (subTab) {
      setAcademicsSubTab(subTab);
    }
    setActiveTab(tab);
  };

  const handleNavigateToPlaceOnMap = (placeId: string) => {
    setMapInitialPlaceId(placeId);
    setActiveTab('map');
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 1. Initial Splash Screen
  if (showSplash) {
    return (
      <MobileShell>
        <SplashScreen onComplete={handleSplashComplete} />
      </MobileShell>
    );
  }

  // 2. Login Screen
  if (!isLoggedIn) {
    return (
      <MobileShell>
        <LoginScreen onLogin={handleLogin} />
      </MobileShell>
    );
  }

  // 3. Loading Skeleton State
  if (isLoading || !student || !attendance) {
    return (
      <MobileShell>
        <div className="w-full h-full bg-slate-50 p-6 flex flex-col justify-between animate-pulse">
          <div className="space-y-4 pt-8">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="h-28 w-full bg-slate-200 rounded-xl" />
            <div className="h-24 w-full bg-slate-200 rounded-xl" />
          </div>
          <div className="text-center pb-8 text-xs text-slate-400">
            Connecting to MVGR campus environment...
          </div>
        </div>
      </MobileShell>
    );
  }

  // 4. Authenticated Student Companion Shell with Global APIProvider
  return (
    <MobileShell>
      <APIProvider 
        apiKey={getGoogleMapsApiKey()} 
        libraries={['marker', 'geometry', 'places']}
        onError={(err) => {
          console.warn('Google Maps API load issue caught safely:', err);
          if (typeof window !== 'undefined') {
            window.__googleMapsAuthError = true;
            window.dispatchEvent(new CustomEvent('google-maps-auth-error'));
          }
        }}
      >
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-white">
          <main className="flex-1 relative overflow-hidden">
            {/* Home Tab Screen */}
            <div className={`w-full h-full ${activeTab === 'home' ? 'flex flex-col' : 'hidden'}`}>
              <HomeScreen
                student={student}
                attendance={attendance}
                todaySchedule={timetable.find((d) => d.isToday) || timetable[0]}
                upcomingExams={upcomingExams}
                onNavigateToTab={handleNavigateToTab}
                onNavigateToPlaceOnMap={handleNavigateToPlaceOnMap}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                unreadNotificationsCount={unreadNotificationsCount}
              />
            </div>

            {/* Map Tab Screen — Persistently mounted to preserve Google Map instance across tab transitions */}
            <div className={`w-full h-full ${activeTab === 'map' ? 'block' : 'hidden'}`}>
              <CampusMap
                initialPlaceId={mapInitialPlaceId}
                onClearInitialPlace={() => setMapInitialPlaceId(null)}
              />
            </div>

            {/* Academics Tab Screen */}
            <div className={`w-full h-full ${activeTab === 'academics' ? 'flex flex-col' : 'hidden'}`}>
              <AcademicsScreen
                initialSubTab={academicsSubTab}
                student={student}
                attendance={attendance}
                timetable={timetable}
                upcomingExams={upcomingExams}
                pastExams={pastExams}
                onNavigateToPlaceOnMap={handleNavigateToPlaceOnMap}
              />
            </div>

            {/* Profile Tab Screen */}
            <div className={`w-full h-full ${activeTab === 'profile' ? 'flex flex-col' : 'hidden'}`}>
              <ProfileScreen
                student={student}
                onSwitchStudent={handleSwitchStudent}
                onLogout={handleLogout}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                unreadCount={unreadNotificationsCount}
              />
            </div>
          </main>

          {/* Minimal Persistent Bottom Navigation */}
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab !== 'map') {
                setMapInitialPlaceId(null);
              }
              setActiveTab(tab);
            }}
            unreadNotifications={unreadNotificationsCount > 0}
          />

          {/* Notifications Modal */}
          {isNotificationsOpen && (
            <NotificationsModal
              notifications={notifications}
              onClose={() => setIsNotificationsOpen(false)}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onSelectNotificationAction={(placeId) => {
                if (placeId) {
                  handleNavigateToPlaceOnMap(placeId);
                }
              }}
            />
          )}
        </div>
      </APIProvider>
    </MobileShell>
  );
}
