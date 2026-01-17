import React from 'react';
import { HelpCircle, FileText, Activity, CheckCircle, Search } from 'lucide-react';

const Help: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <div className="inline-flex p-3 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-2">
                    <HelpCircle className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help?</h1>
                <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Everything you need to know about using PaperProof to improve your academic writing.
                </p>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    Quick Start Guide
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <Step
                        num={1}
                        title="Paste Your Text"
                        desc="Copy your research paper abstract or full text into the input box on the home page."
                    />
                    <Step
                        num={2}
                        title="AI Analysis"
                        desc="Our AI scans your text for structural issues, tone, and checks for potential originality concerns."
                    />
                    <Step
                        num={3}
                        title="Get Feedback"
                        desc="Review the detailed dashboard with scores and actionable recommendations to improve your paper."
                    />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <HelpCard
                    icon={<FileText className="h-5 w-5" />}
                    title="What formats are supported?"
                    description="Currently, we support direct text input. You can paste text from Word, PDF, or any other editor directly into the tool."
                />
                <HelpCard
                    icon={<Search className="h-5 w-5" />}
                    title="How does originality check work?"
                    description="We use advanced search algorithms to compare your text against known sources on the web to identify potential similarity."
                />
                <HelpCard
                    icon={<CheckCircle className="h-5 w-5" />}
                    title="Is the feedback accurate?"
                    description="Our AI is trained on academic standards, but it's an assistant, not a replacement for human review. Always use your judgment."
                />
                <HelpCard
                    icon={<Activity className="h-5 w-5" />}
                    title="Is it free?"
                    description="PaperProof is currently free to use for all researchers and students to help improve academic integrity."
                />
            </div>
        </div>
    );
};

const Step: React.FC<{ num: number, title: string, desc: string }> = ({ num, title, desc }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold text-sm border border-sky-200 dark:border-sky-700">
                {num}
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed pl-11">
            {desc}
        </p>
    </div>
);

const HelpCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
            <div className="text-sky-600 dark:text-sky-400">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-slate-600 dark:text-gray-400 text-sm">
            {description}
        </p>
    </div>
);

export default Help;
