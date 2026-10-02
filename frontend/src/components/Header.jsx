import React from 'react';
import { Bot, Sparkles, Home as HomeIcon } from 'lucide-react';
import ModelBadge from './ModelBadge';

export default function Header({ status, onHomeClick, onConfigClick }) {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Placement<span className="gradient-text">Pal</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 -mt-1 tracking-wider uppercase">
              AI Interview Partner
            </p>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ModelBadge status={status} onClick={onConfigClick} />
          
          <button
            onClick={onHomeClick}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-sm font-medium flex items-center gap-1.5"
            title="Return to Home"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
      </div>
    </header>
  );
}
