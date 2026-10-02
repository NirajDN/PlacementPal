import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConfigModal from './components/ConfigModal';
import Home from './pages/Home';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import FinalResults from './pages/FinalResults';
import { fetchStatus, startInterviewSession } from './services/api';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'setup' | 'interview' | 'results'
  const [status, setStatus] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStatus = async () => {
    const data = await fetchStatus();
    setStatus(data);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Handle Starting Interview Session from Setup page
  const handleStartInterview = async (category, difficulty, totalQuestions) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await startInterviewSession(category, difficulty, totalQuestions);
      setSessionData(data);
      setPage('interview');
    } catch (err) {
      console.error("Failed to start session:", err);
      setError(err.message || "Could not start interview.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Interview Completion
  const handleFinishInterview = (summary) => {
    setSummaryData(summary);
    setPage('results');
  };

  // Reset & restart same category
  const handlePracticeAgain = () => {
    if (sessionData) {
      handleStartInterview(sessionData.categoryId || 'dsa', sessionData.difficulty || 'Medium', sessionData.totalQuestions || 5);
    } else {
      setPage('setup');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        status={status}
        onHomeClick={() => setPage('home')}
        onConfigClick={() => setIsConfigOpen(true)}
      />

      {/* Error Top Banner */}
      {error && (
        <div className="bg-rose-950/80 border-b border-rose-800 p-3 text-center text-xs text-rose-300 flex items-center justify-center gap-2">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline text-white ml-2 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {page === 'home' && (
          <Home
            onStartClick={() => setPage('setup')}
            status={status}
          />
        )}

        {page === 'setup' && (
          <InterviewSetup
            onStartInterview={handleStartInterview}
            isLoading={isLoading}
          />
        )}

        {page === 'interview' && sessionData && (
          <InterviewRoom
            sessionData={sessionData}
            onFinishInterview={handleFinishInterview}
            onEndEarly={() => setPage('setup')}
          />
        )}

        {page === 'results' && (
          <FinalResults
            summaryData={summaryData}
            onPracticeAgain={handlePracticeAgain}
            onNewInterview={() => setPage('setup')}
            onBackHome={() => setPage('home')}
          />
        )}
      </main>

      {/* Config Modal */}
      {isConfigOpen && (
        <ConfigModal
          status={status}
          onClose={() => setIsConfigOpen(false)}
          onRefreshStatus={loadStatus}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <p>
            PlacementPal — Built for Hacktoberfest 2026 Challenge ("Build for a Friend")
          </p>
          <div className="flex items-center gap-3">
            <span className="gradient-text-gemma font-semibold">Google Gemma AI</span>
            <span>•</span>
            <span className="text-slate-400">100% Privacy-Focused</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
