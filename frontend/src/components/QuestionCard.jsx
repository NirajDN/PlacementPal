import React from 'react';
import { HelpCircle, Code2, Layers, Cpu } from 'lucide-react';

export default function QuestionCard({ currentQuestionIndex, totalQuestions, category, difficulty, questionText }) {
  const formatQuestionBody = (text) => {
    if (!text) return null;

    // Split text into paragraphs
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-semibold text-indigo-300 mt-4 mb-2 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('`') && line.endsWith('`')) {
        return (
          <pre key={idx} className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-sm border border-slate-800 my-2 overflow-x-auto">
            <code>{line.replace(/`/g, '')}</code>
          </pre>
        );
      }
      if (line.startsWith('*Hint:*')) {
        return (
          <div key={idx} className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-300 text-xs my-3 flex items-start gap-2">
            <span className="font-semibold uppercase text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200">Hint</span>
            <span>{line.replace('*Hint:*', '')}</span>
          </div>
        );
      }
      return (
        <p key={idx} className="text-slate-200 text-base leading-relaxed my-1.5">
          {line}
        </p>
      );
    });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Easy</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Medium</span>;
      case 'Hard':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">Hard</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">{diff}</span>;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium tracking-wider text-slate-400 uppercase bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            Question {currentQuestionIndex} of {totalQuestions}
          </span>
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            {category}
          </span>
        </div>

        <div>
          {getDifficultyBadge(difficulty)}
        </div>
      </div>

      {/* Main Question Box */}
      <div className="prose prose-invert max-w-none">
        {formatQuestionBody(questionText)}
      </div>
    </div>
  );
}
