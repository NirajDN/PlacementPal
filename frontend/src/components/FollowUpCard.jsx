import React from 'react';
import { HelpCircle, ArrowRight, MessageSquareQuote } from 'lucide-react';

export default function FollowUpCard({ followUpQuestion, onContinue, isLastQuestion }) {
  if (!followUpQuestion) return null;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-indigo-950/60 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-950/90 space-y-5 shadow-2xl animate-fade-in">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
          <MessageSquareQuote className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400 font-semibold">
            Interviewer Adaptive Follow-up
          </span>
          <h4 className="text-base font-bold text-white">
            Follow-Up Question
          </h4>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/30 text-slate-200 text-sm leading-relaxed font-mono">
        {followUpQuestion}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onContinue}
          className="gradient-bg-button text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center gap-2"
        >
          <span>{isLastQuestion ? "View Final Results" : "Continue to Next Question"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
