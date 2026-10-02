import React, { useState } from 'react';
import { Send, SkipForward, StopCircle, CornerDownLeft, FileCode2 } from 'lucide-react';

export default function AnswerInput({ onSubmit, onSkip, onEndInterview, isLoading }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    onSubmit(answer.trim());
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="user-answer" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-indigo-400" />
          Your Answer & Explanation
        </label>
        <span className="text-xs font-mono text-slate-500">
          {answer.length} characters
        </span>
      </div>

      <textarea
        id="user-answer"
        rows={6}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder="Type your explanation, logic step-by-step, code snippet, and time/space complexity here..."
        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono text-sm leading-relaxed resize-y transition-all"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEndInterview}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <StopCircle className="w-3.5 h-3.5" />
            End Interview
          </button>

          <button
            type="button"
            onClick={() => {
              setAnswer('');
              onSkip();
            }}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <SkipForward className="w-3.5 h-3.5 text-slate-400" />
            Skip Question
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
            <CornerDownLeft className="w-3 h-3" /> Ctrl + Enter
          </span>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !answer.trim()}
            className="gradient-bg-button text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Evaluating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Answer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
