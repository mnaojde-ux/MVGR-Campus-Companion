import React, { useEffect } from 'react';
import { mvgrAssets } from '../../assets/mvgrAssets';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-between p-8 overflow-hidden select-none cursor-pointer"
    >
      {/* Real MVGR Main Gate Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src={mvgrAssets.mainGate}
          alt="MVGR College of Engineering Entrance Gate"
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />
        {/* Subtle, natural dark gradient overlay for text readability without AI glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Top institution marker */}
      <div className="relative z-10 pt-4 text-center">
        <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
          Maharaj Vijayaram Gajapathi Raj
        </span>
        <p className="text-[10px] text-slate-400">College of Engineering (Autonomous)</p>
      </div>

      {/* Central Brand */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
        <img
          src={mvgrAssets.crestSvg}
          alt="MVGR Crest"
          className="w-16 h-16 rounded-full mb-3 shadow-lg ring-2 ring-amber-400/30"
        />
        <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
          MVGR
        </h1>
        <p className="text-sm font-semibold text-slate-200 mt-1">
          Campus Companion
        </p>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Vizianagaram, Andhra Pradesh
        </p>
      </div>

      {/* Bottom status and tap hint */}
      <div className="relative z-10 text-center pb-4">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Starting Campus Environment...</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Tap anywhere to continue</p>
      </div>
    </div>
  );
};
