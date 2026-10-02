import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertTriangle, BookOpen, RotateCcw, Home, PlusCircle, Sparkles, Target, BarChart2 } from 'lucide-react';

export default function FinalResults({ summaryData, onPracticeAgain, onNewInterview, onBackHome }) {
  useEffect(() => {
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }, []);

  if (!summaryData) return null;

  const {
    category = "DSA",
    difficulty = "Medium",
    overallScore = 80,
    performanceBadge = "Placement Ready",
    totalQuestions = 5,
    attemptedCount = 5,
    skippedCount = 0,
    strengths = [],
    areasToImprove = [],
    recommendedPractice = [],
    overallFeedback = ""
  } = summaryData;

  const getScoreColor = (score) => {
    if (score >= 85) return "from-emerald-500 to-teal-400 border-emerald-500/40 text-emerald-400";
    if (score >= 70) return "from-indigo-500 to-purple-400 border-indigo-500/40 text-indigo-400";
    if (score >= 50) return "from-amber-500 to-yellow-400 border-amber-500/40 text-amber-400";
    return "from-rose-500 to-red-400 border-rose-500/40 text-rose-400";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-indigo-900/50 text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
          <Award className="w-8 h-8 text-indigo-400" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Interview Complete • {category} ({difficulty})
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Performance Summary
          </h2>
        </div>

        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          {overallFeedback || "Here is your detailed technical evaluation compiled by PlacementPal."}
        </p>

        {/* Score Ring / Card */}
        <div className="pt-4 flex justify-center">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-6 shadow-inner">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black gradient-text font-mono">
                {overallScore}%
              </div>
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                Overall Score
              </div>
            </div>

            <div className="h-12 w-px bg-slate-800"></div>

            <div className="space-y-1 text-left">
              <div className="text-xs text-slate-400 uppercase font-mono">Evaluation Badge</div>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {performanceBadge}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-extrabold text-white font-mono">{totalQuestions}</div>
          <div className="text-xs text-slate-400">Total Questions</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{attemptedCount}</div>
          <div className="text-xs text-slate-400">Attempted</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{skippedCount}</div>
          <div className="text-xs text-slate-400">Skipped</div>
        </div>
      </div>

      {/* Detailed Analysis Grid: Strengths & Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Key Technical Strengths
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Areas to Improve
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {areasToImprove.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Practice Topics */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Recommended Next Topics to Practice
        </h3>
        <div className="flex flex-wrap gap-2.5 pt-1">
          {recommendedPractice.map((topic, idx) => (
            <span
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={onPracticeAgain}
          className="gradient-bg-button text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Practice Again ({category})
        </button>

        <button
          onClick={onNewInterview}
          className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 font-bold text-sm transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-indigo-400" />
          New Interview Setup
        </button>

        <button
          onClick={onBackHome}
          className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 font-medium text-sm transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>

    </div>
  );
}
