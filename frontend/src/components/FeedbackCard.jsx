import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Star, Award, BookOpen } from 'lucide-react';

export default function FeedbackCard({ evaluation }) {
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);

  if (!evaluation) return null;

  const { score = 7, correctness = "Mostly Correct", strengths = [], missingPoints = [], improvement = "", idealAnswer = "" } = evaluation;

  const getCorrectnessStyle = (c) => {
    const text = c.toLowerCase();
    if (text.includes("strong") || text.includes("excellent")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (text.includes("mostly")) {
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    }
    if (text.includes("partially") || text.includes("developing")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
    return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl animate-fade-in">
      
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              AI Evaluation & Feedback
            </h3>
            <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-md text-xs font-medium border ${getCorrectnessStyle(correctness)}`}>
              {correctness}
            </span>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Score</div>
            <div className="text-xl font-black text-white font-mono leading-none">
              {score}<span className="text-xs text-slate-500 font-normal">/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Strengths & Missing Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* What was good */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-emerald-900/30 space-y-3">
          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            What Was Good
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {strengths.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What was missing */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-amber-900/30 space-y-3">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            What Was Missing / Edge Cases
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {missingPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvement */}
      {improvement && (
        <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-2">
          <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            How to Improve Your Answer
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {improvement}
          </p>
        </div>
      )}

      {/* Accordion for Ideal Answer */}
      {idealAnswer && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          <button
            onClick={() => setShowIdealAnswer(!showIdealAnswer)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Suggested Ideal Placement Answer</span>
            </div>
            {showIdealAnswer ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showIdealAnswer && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/80 text-slate-300 text-xs leading-relaxed space-y-3 font-mono">
              <p className="text-slate-200">{idealAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
