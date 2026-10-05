import React from 'react';
import { Home, Map, GraduationCap, User } from 'lucide-react';

export type NavTab = 'home' | 'map' | 'academics' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadNotifications?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  unreadNotifications,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'map' as NavTab, label: 'Map', icon: Map, isHero: true },
    { id: 'academics' as NavTab, label: 'Academics', icon: GraduationCap },
    { id: 'profile' as NavTab, label: 'Profile', icon: User, hasDot: unreadNotifications },
  ];

  return (
    <nav 
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-md max-w-lg mx-auto"
    >
      <div className="flex items-center justify-around h-16 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isHero) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                  isActive ? 'text-blue-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-blue-900 text-white shadow-xs' 
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-blue-950' : 'font-medium text-slate-700'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-blue-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-900' : 'text-slate-500'}`} />
                {tab.hasDot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${
                isActive ? 'font-bold text-blue-950' : 'font-medium text-slate-600'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-blue-900 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
