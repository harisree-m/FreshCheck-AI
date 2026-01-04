
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { analyzeFoodImage } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleImageSelect = useCallback(async (base64: string) => {
    setState(prev => ({ ...prev, image: base64, isAnalyzing: true, error: null, result: null }));
    
    try {
      const analysis = await analyzeFoodImage(base64);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        result: analysis 
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: "Failed to analyze image. Please try again with a clearer photo." 
      }));
    }
  }, []);

  const handleReset = () => {
    setState({
      image: null,
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        {!state.image && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Check Food <span className="text-emerald-600">Freshness</span> instantly.
              </h2>
              <p className="text-lg text-slate-600 max-w-lg mx-auto">
                Upload a photo of your fruit, vegetables, or meat and our AI will assess its quality and provide storage tips.
              </p>
            </div>
            
            <ImageUploader onImageSelect={handleImageSelect} disabled={state.isAnalyzing} />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div className="text-center p-4">
                <div className="text-emerald-600 font-bold text-xl mb-1">Scan</div>
                <p className="text-sm text-slate-500">Capture a clear photo of your food items.</p>
              </div>
              <div className="text-center p-4">
                <div className="text-emerald-600 font-bold text-xl mb-1">Analyze</div>
                <p className="text-sm text-slate-500">AI evaluates visual markers for decay.</p>
              </div>
              <div className="text-center p-4">
                <div className="text-emerald-600 font-bold text-xl mb-1">Save</div>
                <p className="text-sm text-slate-500">Reduce waste with professional tips.</p>
              </div>
            </div>
          </div>
        )}

        {state.image && (
          <div className="space-y-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-xl bg-slate-100">
              <img 
                src={state.image} 
                alt="Uploaded food" 
                className="w-full h-full object-cover"
              />
              {state.isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyzing Freshness...</h3>
                  <p className="text-sm text-emerald-100 text-center animate-pulse">
                    Scanning visual patterns and textures...
                  </p>
                </div>
              )}
            </div>

            {state.error && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-rose-800 font-medium">{state.error}</p>
                  <button 
                    onClick={handleReset}
                    className="mt-2 text-rose-600 text-sm font-bold underline underline-offset-4 hover:text-rose-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {state.result && (
              <ResultDisplay result={state.result} onReset={handleReset} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Powered by Gemini 3 Flash Vision. 
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span> 
            Save money. Save the planet. Stop food waste.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
