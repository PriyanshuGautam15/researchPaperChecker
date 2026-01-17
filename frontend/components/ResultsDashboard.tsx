import React from 'react';
import { AnalysisResult, OriginalityResult, Improvement } from '../types';
import ScoreGauge from './ScoreGauge';
import { AlertTriangle, CheckCircle, Copy, Book, Zap, FileText, ExternalLink } from 'lucide-react';

interface ResultsDashboardProps {
    analysis: AnalysisResult;
    originality: OriginalityResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analysis, originality }) => {

    // Calculate a combined "Master Score"
    const masterScore = Math.round((analysis.overallScore * 0.7) + (originality.score * 0.3));

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'Medium': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'Low': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            default: return 'bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Score Card */}
                <div className="col-span-1 md:col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-800 flex flex-col items-center justify-center transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4 self-start flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" /> Paper Quality
                    </h3>
                    <ScoreGauge score={masterScore} label="Overall Score" color={masterScore > 80 ? '#16a34a' : masterScore > 60 ? '#ca8a04' : '#dc2626'} />
                    <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-4 px-4">
                        Weighted average of formatting, tone, clarity, and originality.
                    </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500 dark:text-neon-400" /> Detailed Metrics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-gray-400">
                                <span>Structure</span>
                                <span className="text-slate-900 dark:text-gray-100">{analysis.metrics.structure}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2.5">
                                <div className="bg-blue-500 dark:bg-neon-400 h-2.5 rounded-full" style={{ width: `${analysis.metrics.structure}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-gray-400">
                                <span>Tone</span>
                                <span className="text-slate-900 dark:text-gray-100">{analysis.metrics.tone}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2.5">
                                <div className="bg-purple-500 dark:bg-purple-400 h-2.5 rounded-full" style={{ width: `${analysis.metrics.tone}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-gray-400">
                                <span>Clarity</span>
                                <span className="text-slate-900 dark:text-gray-100">{analysis.metrics.clarity}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2.5">
                                <div className="bg-cyan-500 dark:bg-cyan-400 h-2.5 rounded-full" style={{ width: `${analysis.metrics.clarity}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-gray-400">
                                <span>Citations</span>
                                <span className="text-slate-900 dark:text-gray-100">{analysis.metrics.citations}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2.5">
                                <div className="bg-indigo-500 dark:bg-indigo-400 h-2.5 rounded-full" style={{ width: `${analysis.metrics.citations}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-50 dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700">
                        <p className="text-slate-700 dark:text-gray-300 italic text-sm">"{analysis.summary}"</p>
                    </div>
                </div>
            </div>

            {/* Row 2: Originality & Format Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Originality Check */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 flex items-center gap-2">
                            <Copy className="h-5 w-5 text-orange-500" /> Source Verification
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${originality.score > 85 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'}`}>
                            {originality.score > 85 ? 'High Originality' : 'Potential Matches Found'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {originality.detailedResult ? (
                            // New Rich Result View
                            <>
                                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium italic">
                                    "{originality.detailedResult.summary}"
                                </p>

                                {originality.detailedResult.suspiciousPatterns.length > 0 && (
                                    <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                        <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-1">Suspicious Patterns</h4>
                                        <ul className="list-disc list-inside text-xs text-orange-800 dark:text-orange-300 space-y-1">
                                            {originality.detailedResult.suspiciousPatterns.map((pattern, idx) => (
                                                <li key={idx}>{pattern}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {originality.detailedResult.matchDetails.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        <h4 className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wide">Detailed Matches</h4>
                                        {originality.detailedResult.matchDetails.map((match, idx) => (
                                            <div key={idx} className="p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300 truncate max-w-[70%]">{match.sourceTitle}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{match.matchPercentage}% Match</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-gray-400 mb-2 line-clamp-2">"{match.matchedText}"</p>
                                                <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-neon-400 hover:underline flex items-center gap-1">
                                                    <ExternalLink className="h-3 w-3" /> Source Link
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-32 bg-slate-50 dark:bg-gray-800 rounded-xl border border-dashed border-slate-200 dark:border-gray-700">
                                        <CheckCircle className="h-8 w-8 text-green-400 dark:text-neon-400 mb-2" />
                                        <span className="text-sm text-slate-500 dark:text-gray-400">No matching online sources found.</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Fallback Legacy View
                            <>
                                <p className="text-sm text-slate-600 dark:text-gray-400">{originality.analysisText}</p>

                                {originality.sources.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wide mb-2">Potential Sources Found</h4>
                                        <ul className="space-y-2">
                                            {originality.sources.map((source, idx) => (
                                                <li key={idx} className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-gray-800 rounded hover:bg-slate-100 dark:hover:bg-gray-750 transition">
                                                    <span className="truncate flex-1 font-medium text-slate-700 dark:text-gray-300 mr-2">{source.title}</span>
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-neon-400 hover:underline flex items-center gap-1 text-xs">
                                                        Visit <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {originality.sources.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-32 bg-slate-50 dark:bg-gray-800 rounded-xl border border-dashed border-slate-200 dark:border-gray-700">
                                        <CheckCircle className="h-8 w-8 text-green-400 dark:text-neon-400 mb-2" />
                                        <span className="text-sm text-slate-500 dark:text-gray-400">No matching online sources found.</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Structure Issues */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Book className="h-5 w-5 text-indigo-500 dark:text-indigo-400" /> Structure & Formatting
                    </h3>
                    {analysis.structureIssues.length > 0 ? (
                        <ul className="space-y-3">
                            {analysis.structureIssues.map((issue, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-700 dark:text-gray-300 bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />
                                    <span>{issue}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-gray-800 rounded-xl border border-dashed border-slate-200 dark:border-gray-700">
                            <CheckCircle className="h-8 w-8 text-green-400 dark:text-neon-400 mb-2" />
                            <span className="text-sm text-slate-500 dark:text-gray-400">Structure looks good!</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Improvements List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-gray-800 transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-6">Actionable Improvements</h3>
                <div className="space-y-4">
                    {analysis.improvements.map((imp: Improvement, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 dark:border-gray-800 rounded-xl hover:shadow-md transition bg-slate-50/30 dark:bg-gray-800/30">
                            <div className="md:w-48 shrink-0">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold mb-2 ${getPriorityColor(imp.priority)}`}>
                                    {imp.priority} Priority
                                </span>
                                <div className="text-sm font-bold text-slate-800 dark:text-gray-200">{imp.section}</div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">{imp.issue}</h4>
                                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{imp.suggestion}</p>
                            </div>
                        </div>
                    ))}
                    {analysis.improvements.length === 0 && (
                        <p className="text-center text-slate-500 dark:text-gray-500 py-8">No major improvements suggested. Excellent work!</p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ResultsDashboard;