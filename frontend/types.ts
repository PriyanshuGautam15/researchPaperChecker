export interface Metric {
  name: string;
  score: number;
  description: string;
}

export interface Improvement {
  section: string;
  issue: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  metrics: {
    structure: number;
    tone: number;
    clarity: number;
    citations: number;
  };
  structureIssues: string[];
  improvements: Improvement[];
}

export interface PlagiarismSource {
  title: string;
  uri: string;
}

export interface PlagiarismMatchDetail {
  sourceUrl: string;
  sourceTitle: string;
  sourceAuthor: string;
  sourceDate: string;
  sourceType: string;
  matchType: string;
  matchedText: string;
  sourceText: string;
  matchPercentage: number;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  location: string;
}

export interface PlagiarismRecommendation {
  issue: string;
  location: string;
  action: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface DetailedOriginalityResult {
  originalityScore: number;
  overallAssessment: string;
  summary: string;
  totalMatchesFound: number;
  matchDetails: PlagiarismMatchDetail[];
  suspiciousPatterns: string[];
  recommendations: PlagiarismRecommendation[];
  confidenceLevel: string;
}

export interface OriginalityResult {
  isOriginal: boolean;
  score: number;
  sources: PlagiarismSource[];
  analysisText: string;
  detailedResult?: DetailedOriginalityResult; // Optional to support legacy/fallback
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING_STRUCTURE = 'ANALYZING_STRUCTURE',
  CHECKING_ORIGINALITY = 'CHECKING_ORIGINALITY',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
