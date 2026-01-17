import React from 'react';
import { Check, Mail } from 'lucide-react';

const Pricing: React.FC = () => {
    // Shared feature list item component for consistency
    const FeatureItem = ({ text, iconColor }: { text: string, iconColor: string }) => (
        <li className="flex items-start gap-3 text-slate-700 dark:text-gray-300">
            <Check className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <span className="text-sm font-medium">{text}</span>
        </li>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500 py-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Transparent <span className="text-blue-600 dark:text-neon-400">Pricing</span> for Everyone
                </h2>
                <p className="text-xl text-slate-600 dark:text-gray-400">
                    Whether you're a student or an enterprise, we have a plan that fits.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Free Plan */}
                <div className="relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl border-b border-l border-green-200 dark:border-green-800 tracking-wide uppercase">
                        Most Popular
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Personal</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$0</span>
                            <span className="text-slate-500 dark:text-gray-400 font-medium">/ forever</span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                            Perfect for students, researchers, and hobbyists working on individual projects.
                        </p>
                    </div>

                    <div className="flex-grow space-y-6 mb-8 border-t border-slate-100 dark:border-gray-800 pt-8">
                        <ul className="space-y-4">
                            <FeatureItem text="Unlimited Paper Checks" iconColor="text-green-500" />
                            <FeatureItem text="Basic Structure Analysis" iconColor="text-green-500" />
                            <FeatureItem text="Tone & Grammar Feedback" iconColor="text-green-500" />
                            <FeatureItem text="100% Free for Personal Use" iconColor="text-green-500" />
                            <FeatureItem text="No Credit Card Required" iconColor="text-green-500" />
                        </ul>
                    </div>

                    <button className="w-full py-4 px-6 bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-gray-700 cursor-default">
                        Current Plan
                    </button>
                </div>

                {/* Commercial Plan */}
                <div className="relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                    {/* Decorative background blob */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="mb-6 relative">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            Commercial
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">Custom</span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                            For universities, enterprises, and organizations requiring high-volume processing and API access.
                        </p>
                    </div>

                    <div className="flex-grow space-y-6 mb-8 border-t border-slate-100 dark:border-gray-800 pt-8 relative">
                        <ul className="space-y-4">
                            <FeatureItem text="High-Volume API Access" iconColor="text-blue-600 dark:text-neon-400" />
                            <FeatureItem text="Bulk Batch Processing" iconColor="text-blue-600 dark:text-neon-400" />
                            <FeatureItem text="Dedicated Engineering Support" iconColor="text-blue-600 dark:text-neon-400" />
                            <FeatureItem text="SLA & Uptime Guarantees" iconColor="text-blue-600 dark:text-neon-400" />
                            <FeatureItem text="Custom LLM Fine-tuning" iconColor="text-blue-600 dark:text-neon-400" />
                        </ul>
                    </div>

                    <button
                        onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=priyanshu15gautam@gmail.com", "_blank")}
                        className="group relative w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
                    >
                        <span>Let's Connect</span>
                        <Mail className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
