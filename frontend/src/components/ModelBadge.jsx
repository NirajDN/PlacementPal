import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export default function ModelBadge({ status, onClick }) {
  const providerLabel = status?.providerLabel || "Google Gemma 2 (Open-Weight Model)";

  return (
    <div 
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 group text-xs font-medium text-slate-300"
      title="Click to view AI Model Configuration"
    >
      <span className="relative flex h-2 w-2">
        <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
      <span className="gradient-text-gemma font-semibold">{providerLabel}</span>
      <Cpu className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
    </div>
  );
}
