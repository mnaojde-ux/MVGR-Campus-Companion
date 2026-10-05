import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  MapPin, 
  AlertCircle, 
  Info,
  CheckSquare,
  Square,
  ShieldCheck
} from 'lucide-react';
import { mvgrAssets } from '../../assets/mvgrAssets';
import { studentService } from '../../services/studentService';

interface LoginScreenProps {
  onLogin: (studentId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('22331A0589');
  const [password, setPassword] = useState('mvgr@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Student ID or College Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = await studentService.authenticateStudent(identifier, password);
    setIsSubmitting(false);

    if (result.success && result.studentId) {
      onLogin(result.studentId);
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your student roll number or password.');
    }
  };

  const handleDemoLogin = (studentId: string) => {
    if (studentId === 'arjun') {
      setIdentifier('24331A0512');
      setPassword('arjun@mvgr');
    } else {
      setIdentifier('22331A0589');
      setPassword('manoj@mvgr');
    }
    onLogin(studentId);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-y-auto select-none">
      {/* 
        REAL MVGR MAIN GATE PHOTOGRAPH
        Natural appearance preserved: no artificial distortion, minimal dark overlay only where needed for readability.
      */}
      <div className="absolute inset-0 z-0">
        <img
          src={mvgrAssets.mainGate}
          alt="MVGR College of Engineering Autonomous Main Gate"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.02]"
        />
        {/* Subtle, restrained dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
      </div>

      {/* Top Header Branding */}
      <header className="relative z-10 pt-8 sm:pt-10 px-6 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/70 shadow-sm">
          <img 
            src={mvgrAssets.crestSvg} 
            alt="MVGR Autonomous Crest" 
            className="w-4 h-4 rounded-full"
          />
          <span className="text-xs font-bold tracking-widest text-amber-400">MVGR</span>
          <span className="text-[10px] text-slate-300 font-semibold">AUTONOMOUS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          Campus Companion
        </h1>
        <p className="text-xs text-slate-200 mt-1 font-medium tracking-wide">
          &ldquo;Your campus, connected.&rdquo;
        </p>
      </header>

      {/* Central Login Card */}
      <div className="relative z-10 px-4 sm:px-6 py-4 max-w-sm mx-auto w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-2xl border border-slate-200">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in with your student credentials
            </p>
          </div>

          {/* Professional Inline Error */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label 
                htmlFor="student-id-input"
                className="text-[11px] font-semibold text-slate-700 block mb-1"
              >
                Student ID / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-id-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. 22331A0589"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password-input"
                className="text-[11px] font-semibold text-slate-700 block mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your student password"
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-[11px] transition-colors"
              >
                {rememberMe ? (
                  <CheckSquare className="w-3.5 h-3.5 text-blue-900" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Remember me</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-blue-900 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing in...' : 'SIGN IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-2 text-center">
              Demonstration Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('manoj')}
                className="p-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold text-center transition-colors border border-slate-200"
              >
                Manoj (3rd Year)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('arjun')}
                className="p-2 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-900 rounded-lg text-xs font-semibold text-center border border-blue-200 transition-colors"
              >
                Arjun (1st Year)
              </button>
            </div>
          </div>
        </div>

        {/* Footer address */}
        <div className="mt-3 text-center text-[11px] text-slate-300 flex items-center justify-center gap-1.5">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>Vijayaram Nagar, Chintalavalasa, Vizianagaram</span>
        </div>
      </div>

      {/* Forgot Password Assistance Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xs w-full p-4 space-y-3 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Info className="w-4 h-4 text-blue-900" />
              <span>Password Assistance</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Student login credentials are administered by the Autonomous Examination Cell. To reset your password, visit the Admin Block ground floor right wing with your College ID card.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
