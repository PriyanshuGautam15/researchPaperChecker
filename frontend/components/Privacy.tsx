import React from 'react';
import { ShieldCheck, Zap, Lock, Heart, Shield } from 'lucide-react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <div className="inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Privacy First</h1>
                <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                    We believe powerful tools should be safe and transparent. Here is how we ensure your experience is secure and worry-free.
                </p>
            </div>

            {/* Content Sections */}
            <div className="grid gap-6 md:grid-cols-2">
                <PrivacyCard
                    icon={<Zap className="h-6 w-6" />}
                    title="World-Class Intelligence"
                    description="We partner with trusted industry leaders like Groq for lightning-fast structure analysis, and use free academic databases (Semantic Scholar, arXiv) plus privacy-focused DuckDuckGo for comprehensive originality verification."
                />
                <PrivacyCard
                    icon={<Lock className="h-6 w-6" />}
                    title="Secure & Stateless"
                    description="Your privacy is paramount. Your documents are processed in real-time for analysis and are never permanently stored on our servers."
                />
                <PrivacyCard
                    icon={<Shield className="h-6 w-6" />}
                    title="Privacy-First Approach"
                    description="We use privacy-focused search engines like DuckDuckGo and public academic APIs that don't track your data, ensuring your research remains confidential."
                />
                <PrivacyCard
                    icon={<Heart className="h-6 w-6" />}
                    title="You're in Control"
                    description="We act as a helpful assistant for your writing. You retain full ownership of your work, and we are just here to help you polish it."
                />
            </div>

            <div className="mt-12 p-6 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Our Commitment</h2>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                    <p>
                        We built PaperProof to be a tool you can trust, ensuring your data security is our top priority. While you use this tool at your own risk, we are dedicated to providing a safe, secure, and reliable environment for your academic success. By using our service, you agree to let us help you improve your work using these secure technologies.
                    </p>
                </div>
            </div>
        </div>
    );
};

interface PrivacyCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const PrivacyCard: React.FC<PrivacyCardProps> = ({ icon, title, description }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-3">
                <div className="text-green-600 dark:text-green-400">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            </div>
            <p className="text-slate-600 dark:text-gray-400 text-sm">
                {description}
            </p>
        </div>
    )
}

export default Privacy;
