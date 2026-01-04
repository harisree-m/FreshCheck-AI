
import React from 'react';
import { AnalysisResult, FreshnessStatus } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const getStatusConfig = (status: FreshnessStatus) => {
    switch (status) {
      case FreshnessStatus.FRESH:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          label: 'Fresh & High Quality'
        };
      case FreshnessStatus.OKAY:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
          label: 'Okay - Use Soon'
        };
      case FreshnessStatus.AVOID:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
          label: 'Avoid - Low Quality'
        };
    }
  };

  const config = getStatusConfig(result.status);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className={`p-6 rounded-2xl border ${config.bg} ${config.border}`}>
        <div className="flex items-center gap-4 mb-4">
          <svg className={`w-10 h-10 ${config.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} />
          </svg>
          <div>
            <h2 className={`text-2xl font-bold ${config.text}`}>{config.label}</h2>
            <p className="text-slate-600 font-medium">Category: {result.category}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/60 p-4 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">AI Reasoning</h4>
            <p className="text-slate-800 leading-relaxed">{result.reasoning}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 p-4 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Confidence Score</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${config.text.replace('text', 'bg')}`} 
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>
            <div className="bg-white/60 p-4 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estimated Shelf Life</h4>
              <p className="text-slate-800 font-bold text-lg">{result.shelfLife}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Optimal Storage Tips
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.storageTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-emerald-600 font-bold">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
      >
        Scan Another Item
      </button>
    </div>
  );
};

export default ResultDisplay;
