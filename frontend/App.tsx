import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PaperInput from './components/PaperInput';
import Privacy from './components/Privacy';
import Help from './components/Help';
import ResultsDashboard from './components/ResultsDashboard';
import Pricing from './components/Pricing';
import { AnalysisResult, OriginalityResult, AnalysisStatus } from './types';
import { analyzePaperStructure, checkPaperOriginality } from './services/geminiService';
import { PLACEHOLDER_ANALYSIS, PLACEHOLDER_ORIGINALITY } from './constants';
import { AlertCircle, Coffee } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(PLACEHOLDER_ANALYSIS);
  const [originalityResult, setOriginalityResult] = useState<OriginalityResult>(PLACEHOLDER_ORIGINALITY);
  const [error, setError] = useState<string | null>(null);

  // Dark mode state - default to false (light)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Navigation state
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAnalyze = async (text: string) => {
    setError(null);
    setStatus(AnalysisStatus.ANALYZING_STRUCTURE);

    // Reset previous results
    setAnalysisResult(PLACEHOLDER_ANALYSIS);
    setOriginalityResult(PLACEHOLDER_ORIGINALITY);

    try {
      // Step 1: Analyze Structure (Fast, Format check)
      const structRes = await analyzePaperStructure(text);
      setAnalysisResult(structRes);

      // Step 2: Check Originality (Slower, Search tool)
      setStatus(AnalysisStatus.CHECKING_ORIGINALITY);
      const origRes = await checkPaperOriginality(text);
      setOriginalityResult(origRes);

      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error("Analysis flow failed:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl transition-colors">
                Paper<span className="text-blue-600 dark:text-neon-400 transition-colors">Proof</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-gray-400 transition-colors">
                Get instant feedback on formatting, academic tone, and verify content originality with Intelligence and Logical Analysis.
              </p>
            </div>

            {/* Input Section */}
            <section className="flex justify-center">
              <PaperInput
                onAnalyze={handleAnalyze}
                isAnalyzing={status === AnalysisStatus.ANALYZING_STRUCTURE || status === AnalysisStatus.CHECKING_ORIGINALITY}
              />
            </section>

            {/* Status Indicators */}
            {status !== AnalysisStatus.IDLE && status !== AnalysisStatus.ERROR && (
              <div className="max-w-xl mx-auto text-center space-y-2">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-neon-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                    style={{ width: status === AnalysisStatus.COMPLETE ? '100%' : status === AnalysisStatus.CHECKING_ORIGINALITY ? '70%' : '30%' }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-neon-400 animate-pulse">
                  {status === AnalysisStatus.ANALYZING_STRUCTURE && "Analyzing document structure and tone..."}
                  {status === AnalysisStatus.CHECKING_ORIGINALITY && "Verifying sources and checking originality..."}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Results Section */}
            {status === AnalysisStatus.COMPLETE && (
              <div id="results">
                <ResultsDashboard analysis={analysisResult} originality={originalityResult} />
              </div>
            )}
          </>
        ) : currentView === 'pricing' ? (
          <Pricing />
        ) : currentView === 'privacy' ? (
          <Privacy />
        ) : (
          <Help />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-8 mt-12 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-3 text-center">
          <p className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 font-medium">
            Empowering Research with AI & Integrity
          </p>
          <p className="text-xs text-slate-400 dark:text-gray-600">
            © {new Date().getFullYear()} PaperProof. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;