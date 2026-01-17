import { AnalysisResult, OriginalityResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

/**
 * Analyzes the paper structure by calling the Python Flask backend.
 */
export const analyzePaperStructure = async (text: string): Promise<AnalysisResult> => {
  if (!text || text.length < 50) {
    throw new Error("Text is too short for analysis.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze-structure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Map the backend's detailed issue arrays into the frontend's expected format
    // The backend provides structure, tone, clarity, and citation issues separately.
    // We combine them here to display in the "Structure & Formatting" card, 
    // or you could update types.ts to support separate categories.
    const combinedIssues = [
      ...(data.structureIssues || []),
      ...(data.toneIssues || []),
      ...(data.clarityIssues || []),
      ...(data.citationIssues || [])
    ];

    return {
      overallScore: data.overallScore,
      summary: data.summary,
      metrics: data.metrics,
      structureIssues: combinedIssues.length > 0 ? combinedIssues : ["No major issues found."],
      improvements: data.improvements
    };

  } catch (error: any) {
    console.error("Structure Analysis Error:", error);
    throw new Error(error.message || "Failed to connect to the analysis server.");
  }
};

/**
 * Checks for originality by calling the Python Flask backend.
 */
export const checkPaperOriginality = async (text: string): Promise<OriginalityResult> => {
  if (!text || text.length < 50) {
    return { isOriginal: true, score: 100, sources: [], analysisText: "Text too short to check." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/check-originality`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as OriginalityResult;

  } catch (error: any) {
    console.error("Originality Check Error:", error);
    return {
      isOriginal: true,
      score: 100,
      sources: [],
      analysisText: error.message || "Unable to verify originality."
    };
  }
};