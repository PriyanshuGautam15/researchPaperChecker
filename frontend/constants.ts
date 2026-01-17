// Placeholders used when API key is missing or for initial states
export const PLACEHOLDER_ANALYSIS = {
  overallScore: 0,
  summary: "Awaiting analysis...",
  metrics: { structure: 0, tone: 0, clarity: 0, citations: 0 },
  structureIssues: [],
  improvements: []
};

export const PLACEHOLDER_ORIGINALITY = {
  isOriginal: true,
  score: 0,
  sources: [],
  analysisText: ""
};
