import React, { useState } from 'react';
import { X, Cpu, Key, ShieldCheck, Check, Terminal } from 'lucide-react';

export default function ConfigModal({ status, onClose, onRefreshStatus }) {
  const [provider, setProvider] = useState(status?.provider || 'ollama');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Model Architecture</h3>
              <p className="text-xs text-slate-400">Open-Weight AI Model Settings (Google Gemma)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Status */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Active Configuration</div>
          <div className="flex items-center justify-between text-sm font-semibold text-white">
            <span className="gradient-text-gemma font-bold">{status?.providerLabel || "Google Gemma 2 (Local / Fallback)"}</span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Model Name: <span className="text-slate-300">{status?.modelName || 'gemma2:9b'}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Supported Open-Weight Providers</h4>
          
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Ollama Local Inference (Default)</strong>
                <p className="text-slate-400 mt-0.5">Runs 100% offline & privately on your machine using <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">ollama run gemma2:9b</code>.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Key className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Groq / OpenRouter / Google AI Studio API</strong>
                <p className="text-slate-400 mt-0.5">Configure <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">GROQ_API_KEY</code> or <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">GEMINI_API_KEY</code> in <code className="text-slate-200">.env</code> for high-speed remote cloud inference.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="gradient-bg-button text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
}
