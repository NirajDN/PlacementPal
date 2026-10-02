import React from 'react';
import { Bot, ArrowRight, Sparkles, Code2, CheckCircle2, ShieldCheck, Zap, Award, Target, MessageSquareQuote } from 'lucide-react';

export default function Home({ onStartClick, status }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        
        {/* Open-Weight AI Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Powered by <strong className="gradient-text-gemma font-bold">Google Gemma</strong> Open-Weight AI</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Placement<span className="gradient-text">Pal</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-semibold text-slate-200">
          "Your private AI interview partner."
        </p>

        {/* Short Product Explanation */}
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          Preparing for tech placement interviews can be intimidating without a realistic practice partner.
          PlacementPal acts as your personal interviewer—asking targeted DSA, JavaScript, and Behavioral questions, evaluating your answers, giving actionable feedback, and posing adaptive follow-ups.
        </p>

        {/* Call to Action Button */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartClick}
            className="gradient-bg-button text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-3 group"
          >
            <span>Start Practice Interview</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        <div className="glass-card glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Curated Placement Tracks</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practice DSA (Arrays, Trees, Binary Search), JavaScript (Closures, Promises, Event Loop), and HR/Behavioral questions.
          </p>
        </div>

        <div className="glass-card glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Structured AI Feedback</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get immediate evaluations with correctness scores, strengths, missing edge cases, improvement tips, and ideal answers.
          </p>
        </div>

        <div className="glass-card glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
            <MessageSquareQuote className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Adaptive Follow-ups</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The AI interviewer asks relevant follow-up questions tailored to your answer just like a real engineering interviewer.
          </p>
        </div>

      </div>

      {/* Why Open-Weight Section */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Built with Open-Weight AI (Google Gemma)</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          PlacementPal is powered by Google Gemma open-weight models. Unlike black-box proprietary APIs, open models empower developers to run offline locally via Ollama or host custom inference endpoints with full control over privacy, data sovereignty, and custom prompt tuning.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 100% Anonymous & Private
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Local Ollama & Cloud APIs
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Hacktoberfest 2026 Challenge
          </span>
        </div>
      </div>

    </div>
  );
}
