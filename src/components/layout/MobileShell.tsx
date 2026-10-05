import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'phone' | 'wide'>('phone');

  return (
    <div className="min-h-screen bg-slate-900 sm:bg-slate-950 flex flex-col items-center justify-center sm:p-4 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Laptop / Large Display Viewport Switcher */}
      <div className="hidden lg:flex items-center gap-2 mb-2 px-3 py-1 bg-slate-900/90 rounded-full border border-slate-800 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">MVGR Campus Companion</span>
        <span>•</span>
        <button
          onClick={() => setViewMode('phone')}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
            viewMode === 'phone' ? 'bg-blue-900 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>Mobile (390px)</span>
        </button>
        <button
          onClick={() => setViewMode('wide')}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors ${
            viewMode === 'wide' ? 'bg-blue-900 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3 h-3" />
          <span>Spacious (540px)</span>
        </button>
      </div>

      {/* Main App Frame */}
      <main 
        id="app-root"
        className={`w-full ${viewMode === 'phone' ? 'max-w-[414px]' : 'max-w-[540px]'} h-[100dvh] sm:h-[844px] sm:max-h-[92vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden sm:border sm:border-slate-800 transition-all duration-200`}
      >
        {children}
      </main>
    </div>
  );
};
