import React, { useState } from 'react';
import { Code2, FileCode, UserCheck, Play, Sparkles, Sliders, Hash, Gauge } from 'lucide-react';

export default function InterviewSetup({ onStartInterview, isLoading }) {
  const [category, setCategory] = useState('dsa');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);

  const categories = [
    {
      id: 'dsa',
      title: 'DSA / Coding',
      icon: Code2,
      color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/40 text-indigo-400',
      description: 'Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stack/Queue, Binary Search, Trees'
    },
    {
      id: 'javascript',
      title: 'JavaScript & Web',
      icon: FileCode,
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-400',
      description: 'let/const/var, Closures, Promises, async/await, Event Loop, Hoisting, Array methods, DOM'
    },
    {
      id: 'hr',
      title: 'HR & Behavioral',
      icon: UserCheck,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
      description: 'Tell me about yourself, Strengths & weaknesses, Project discussion, Teamwork, Conflict'
    }
  ];

  const difficulties = [
    { id: 'Easy', label: 'Easy', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'Medium', label: 'Medium', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'Hard', label: 'Hard', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  ];

  const questionCounts = [5, 10];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onStartInterview(category, difficulty, totalQuestions);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interview Setup</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Configure Your Placement Practice
        </h2>
        <p className="text-sm text-slate-400">
          Select your target placement track, difficulty level, and question count.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            1. Select Category
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 relative ${
                    isSelected
                      ? `bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/20`
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            2. Select Difficulty
          </label>

          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((diff) => {
              const isSelected = difficulty === diff.id;

              return (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Question Count */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-400" />
            3. Number of Questions
          </label>

          <div className="grid grid-cols-2 gap-4">
            {questionCounts.map((count) => {
              const isSelected = totalQuestions === count;

              return (
                <button
                  type="button"
                  key={count}
                  onClick={() => setTotalQuestions(count)}
                  className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {count} Questions Session
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Interview CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-bg-button text-white text-lg font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Preparing Your Interview Room...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Interview</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
