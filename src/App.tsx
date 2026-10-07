import React, { useState, useEffect } from 'react';
import { UserProfile, ResumeData, CoverLetterData } from './types/resume';
import { onAuthChange, syncUserProfile, logoutUser } from './services/auth';
import { getUserResumes, getUserCoverLetters } from './services/resumeService';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { CoverLetterBuilder } from './components/cover-letter/CoverLetterBuilder';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import {
  FileText,
  Layers,
  Sparkles,
  LogOut,
  User as UserIcon,
  Shield,
  Loader2,
  Menu,
  X,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  
  // Navigation view state
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'editor' | 'coverLetters' | 'admin'
  >('landing');
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user data helper
  const loadUserData = async (uid: string) => {
    try {
      const [resList, clList] = await Promise.all([
        getUserResumes(uid),
        getUserCoverLetters(uid),
      ]);
      setResumes(resList);
      setCoverLetters(clList);
    } catch (err) {
      console.error('Error fetching user records:', err);
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await syncUserProfile(firebaseUser);
          setCurrentUser(profile);
          await loadUserData(profile.userId);
          if (currentView === 'landing') {
            setCurrentView('dashboard');
          }
        } catch (err) {
          console.error('Failed to sync user profile:', err);
          const fallbackProfile: UserProfile = {
            userId: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            photoURL: firebaseUser.photoURL || undefined,
            role: firebaseUser.email === 'zakatushrchitral@gmail.com' ? 'admin' : 'user',
            subscription: 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setCurrentUser(fallbackProfile);
          await loadUserData(firebaseUser.uid);
          if (currentView === 'landing') {
            setCurrentView('dashboard');
          }
        }
      } else {
        setCurrentUser(null);
        setResumes([]);
        setCoverLetters([]);
        setCurrentView('landing');
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const openResumeEditor = (resume: ResumeData) => {
    setActiveResume(resume);
    setCurrentView('editor');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-2xl mb-4 shadow-lg shadow-indigo-600/50 animate-pulse">
          CV
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Loading Professional AI Resume & CV Builder...</span>
        </div>
      </div>
    );
  }

  // 1. LANDING PAGE VIEW (or not logged in)
  if (currentView === 'landing' || !currentUser) {
    return (
      <>
        <LandingPage
          onGetStarted={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
          onExploreTemplates={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onLogin={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(profile) => {
            setCurrentUser(profile);
            setCurrentView('dashboard');
            loadUserData(profile.userId);
          }}
        />
      </>
    );
  }

  // 2. RESUME EDITOR VIEW
  if (currentView === 'editor' && activeResume) {
    return (
      <ResumeEditor
        initialData={activeResume}
        onBack={() => {
          if (currentUser) loadUserData(currentUser.userId);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // 3. COVER LETTERS VIEW
  if (currentView === 'coverLetters' && currentUser) {
    return (
      <CoverLetterBuilder
        userId={currentUser.userId}
        coverLetters={coverLetters}
        onBack={() => setCurrentView('dashboard')}
        onRefresh={() => loadUserData(currentUser.userId)}
      />
    );
  }

  // 4. ADMIN PANEL VIEW
  if (currentView === 'admin' && currentUser) {
    return (
      <AdminPanel
        user={currentUser}
        totalResumesCount={resumes.length}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  // 5. MAIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* SaaS Dashboard App Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-8">
          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 text-xs shrink-0">
              CV
            </div>
            <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 truncate max-w-[180px] sm:max-w-none">
              Professional <span className="text-indigo-600">CV Builder</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className={`transition hover:text-indigo-600 ${
                currentView === 'dashboard' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              My Resumes
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('coverLetters')}
              className="transition hover:text-indigo-600"
            >
              Cover Letters
            </button>
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="transition hover:text-indigo-600 flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 text-right">
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {currentUser?.displayName || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                {currentUser?.email}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200 shrink-0">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{currentUser?.displayName?.charAt(0) || 'U'}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:flex p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg px-4 py-3 space-y-2 sticky top-16 z-20">
          <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-xs font-bold text-slate-800 block">
              {currentUser?.displayName || 'User'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate">
              {currentUser?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${
              currentView === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>My Resumes ({resumes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('coverLetters');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${
              currentView === 'coverLetters'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Cover Letters Studio ({coverLetters.length})</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 transition"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Admin Console</span>
            </button>
          )}

          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-10 py-5 sm:py-8">
        <Dashboard
          user={currentUser}
          resumes={resumes}
          onOpenResume={openResumeEditor}
          onOpenCoverLetters={() => setCurrentView('coverLetters')}
          onOpenAdmin={() => setCurrentView('admin')}
          onRefresh={() => loadUserData(currentUser.userId)}
        />
      </main>
    </div>
  );
}
