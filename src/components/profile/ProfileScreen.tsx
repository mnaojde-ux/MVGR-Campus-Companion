import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Bell, 
  Map, 
  Info, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Users,
  Compass,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { StudentProfile } from '../../data/student';
import { mvgrAssets } from '../../assets/mvgrAssets';

interface ProfileScreenProps {
  student: StudentProfile;
  onSwitchStudent: (studentId: string) => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  student,
  onSwitchStudent,
  onLogout,
  onOpenNotifications,
  unreadCount,
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'academic' | 'mapPrefs' | 'about'>('main');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-5 pt-5 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-900 border border-blue-700 flex items-center justify-center text-white font-bold text-base shadow-xs">
            {student.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight truncate">
              {student.name}
            </h1>
            <p className="text-xs text-slate-300 truncate">
              {student.program}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {student.year} • Semester {student.semester}
            </p>
          </div>
        </div>

        {/* Identity Details Row */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Roll No</span>
            <span className="font-mono font-bold text-white text-xs">{student.rollNo}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Section</span>
            <span className="font-bold text-white text-xs">Sec {student.section}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="font-medium text-emerald-400 text-xs">Autonomous</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3.5 max-w-lg mx-auto">
        {/* Capstone Persona Switcher */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-900" />
              Demo Student Persona
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Capstone Testing
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSwitchStudent('manoj')}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                student.id === 'manoj'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Manoj (3rd Year)
            </button>
            <button
              onClick={() => onSwitchStudent('arjun')}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                student.id === 'arjun'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Arjun (1st Year)
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-xs">
          {/* 1. Academic Information */}
          <button
            onClick={() => setActiveSection(activeSection === 'academic' ? 'main' : 'academic')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Academic Details</p>
                <p className="text-[11px] text-slate-500">Degree, regulations, faculty advisor</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {activeSection === 'academic' && (
            <div className="p-3.5 bg-slate-50 text-xs space-y-1.5 border-t border-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">College Email:</span>
                <span className="font-mono text-slate-800">{student.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{student.department}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Faculty Advisor:</span>
                <span className="font-medium text-slate-800">{student.advisor}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Autonomous Reg:</span>
                <span className="font-medium text-emerald-800">MVGR-A20 Regulations</span>
              </div>
            </div>
          )}

          {/* 2. Notifications */}
          <button
            onClick={onOpenNotifications}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Notifications</p>
                <p className="text-[11px] text-slate-500">Exams and circulars</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                  {unreadCount}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 3. Map Preferences */}
          <button
            onClick={() => setActiveSection(activeSection === 'mapPrefs' ? 'main' : 'mapPrefs')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Map className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">Map Preferences</p>
                <p className="text-[11px] text-slate-500">Walking pace and default arrival point</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {activeSection === 'mapPrefs' && (
            <div className="p-3.5 bg-slate-50 text-xs space-y-2 border-t border-slate-100">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Default Starting Point</label>
                <select className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800">
                  <option>MVGR Main Gate (Bus / Auto Drop)</option>
                  <option>BS&H Block (1st Year Foyer)</option>
                  <option>Central Library Quadrangle</option>
                </select>
              </div>
            </div>
          )}

          {/* 4. About MVGR */}
          <button
            onClick={() => setActiveSection(activeSection === 'about' ? 'main' : 'about')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">About MVGR</p>
                <p className="text-[11px] text-slate-500">Campus history and autonomous accreditation</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {activeSection === 'about' && (
            <div className="p-3.5 bg-slate-50 text-xs space-y-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={mvgrAssets.adminBlock}
                    alt="MVGR Administrative Block"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">
                    Admin Block
                  </span>
                </div>

                <div className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={mvgrAssets.mainGate}
                    alt="MVGR Campus Gate"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">
                    Main Gate
                  </span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed text-xs">
                Maharaj Vijayaram Gajapathi Raj (MVGR) College of Engineering was established in 1997 by the MANSAS Trust, founded by Dr. P.V.G. Raju, former Raja Saheb of Vizianagaram. It is an Autonomous Institution accredited by NAAC with &apos;A&apos; Grade and permanently affiliated to JNTU-GV.
              </p>

              <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1">
                <p>• <strong>Campus Area:</strong> 43 Acres in Vijayaram Nagar, Chintalavalasa</p>
                <p>• <strong>Iconic Landmarks:</strong> Autonomous Arched Gate & Heritage Admin Block</p>
                <p>• <strong>Official Portal:</strong> www.mvgrce.edu.in</p>
              </div>
            </div>
          )}

          {/* 5. Logout */}
          <button
            onClick={onLogout}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <div className="text-center py-2 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-600">MVGR Campus Companion</p>
          <p>Digital Engineering Lab Capstone • Vizianagaram</p>
        </div>
      </div>
    </div>
  );
};
