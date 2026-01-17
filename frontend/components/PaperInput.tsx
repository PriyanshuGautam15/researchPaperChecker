import React, { useRef, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

interface PaperInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const PaperInput: React.FC<PaperInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
        let extractedText = '';

        if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                fullText += pageText + '\n\n';
            }
            extractedText = fullText;

        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.endsWith('.docx')
        ) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            extractedText = result.value;
            if (result.messages.length > 0) {
                console.warn("Mammoth messages:", result.messages);
            }

        } else {
            // Default text/md handling
            extractedText = await file.text();
        }

        if (extractedText.trim().length === 0) {
            throw new Error("Could not extract text from this file. It might be empty or scanned images.");
        }

        setText(extractedText);
    } catch (error) {
        console.error("File processing error:", error);
        alert("Failed to process file. Please ensure it is a valid text-based PDF, DOCX, or text file.");
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
        setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-semibold text-slate-800 dark:text-gray-200 transition-colors">Research Paper Content</label>
        <p className="text-sm text-slate-500 dark:text-gray-400 transition-colors">Paste your text below or upload a PDF, DOCX, or text file.</p>
      </div>

      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing || isProcessing}
          placeholder={isProcessing ? "Reading file content..." : "Paste your Abstract, Introduction, or full paper text here..."}
          className="w-full h-96 p-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-400 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed placeholder-slate-400 dark:placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-gray-800"
        />
        {text && !isAnalyzing && !isProcessing && (
            <button 
                onClick={handleClear}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-gray-800 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 transition"
                title="Clear text"
            >
                <X className="h-4 w-4" />
            </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.tex,.pdf,.docx"
                className="hidden" 
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing || isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600 transition-all text-sm font-medium disabled:opacity-50"
            >
                {isProcessing ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : fileName ? 'Change File' : 'Upload PDF / DOCX / Text'}
            </button>
            {fileName && !isProcessing && <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1"><FileText className="h-3 w-3"/> {fileName}</span>}
        </div>

        <div className="flex items-center gap-4">
             <span className="text-xs text-slate-400 dark:text-gray-500 font-medium">
                {text.length} characters
             </span>
            <button
                onClick={() => onAnalyze(text)}
                disabled={!text || isAnalyzing || isProcessing || text.length < 50}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-neon-500 dark:hover:bg-neon-400 disabled:bg-slate-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white dark:text-black rounded-lg font-semibold shadow-md shadow-blue-600/20 dark:shadow-neon-400/20 transition-all flex items-center gap-2"
            >
                {isAnalyzing ? (
                    <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" />
                    Analyzing...
                    </>
                ) : (
                    'Run Audit'
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaperInput;