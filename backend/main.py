import os
import json
import requests
from flask import Flask, request, jsonify
from google import genai
from google.genai import types
from dotenv import load_dotenv
from flask_cors import CORS
from duckduckgo_search import DDGS




load_dotenv()

app = Flask(__name__)

# CORS Configuration - supports both local and production
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGIN", "http://localhost:3000")
# Split by comma for multiple origins
origins_list = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

CORS(app, resources={r"/*": {
    "origins": origins_list,
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})


OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_URL = os.environ.get("O_R_URL")
OPENROUTER_MODEL = os.environ.get("O_R_MODEL")

# Groq Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
gemini_client = None

if GOOGLE_API_KEY:
    gemini_client = genai.Client(api_key=GOOGLE_API_KEY)
else:
    print("WARNING: GOOGLE_API_KEY not found. Originality check will fail.")

#----------------------------------------------------------------------------------------------

# --- Helper: OpenRouter Call ---
def call_openrouter(messages, temperature=0.2):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Paper Analyzer"
    }
    
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "reasoning": {"enabled": True},  # Enable reasoning
        "temperature": temperature
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"OpenRouter API Error: {e}")
        raise e


# --- Helper: Groq Call ---
def call_groq(messages, temperature=0.2):
    """Call Groq API for fast inference."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment variables")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": temperature
    }

    print(f"[DEBUG] Groq API Request:")
    print(f"  URL: {GROQ_URL}")
    print(f"  Model: {GROQ_MODEL}")
    print(f"  Messages count: {len(messages)}")
    
    try:
        response = requests.post(GROQ_URL, headers=headers, data=json.dumps(payload))
        print(f"[DEBUG] Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"[DEBUG] Response Body: {response.text}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Groq API Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"[ERROR] Response Status: {e.response.status_code}")
            print(f"[ERROR] Response Body: {e.response.text}")
        raise e


# --- Helper: DuckDuckGo Search ---
def search_duckduckgo(query, max_results=10):
    """Search the web using DuckDuckGo for potential plagiarism sources."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            return [{
                "title": r.get("title", "Unknown"),
                "url": r.get("href", "#"),
                "snippet": r.get("body", ""),
                "source": "DuckDuckGo"
            } for r in results]
    except Exception as e:
        print(f"DuckDuckGo Search Error: {e}")
        return []


# --- Helper: Semantic Scholar Search ---
def search_semantic_scholar(query, limit=10):
    """Search academic papers using Semantic Scholar API."""
    try:
        url = "https://api.semanticscholar.org/graph/v1/paper/search"
        params = {
            "query": query,
            "limit": limit,
            "fields": "title,authors,year,abstract,url,citationCount,publicationDate"
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = []
        if "data" in data:
            for paper in data["data"]:
                authors = ", ".join([a.get("name", "") for a in paper.get("authors", [])])
                results.append({
                    "title": paper.get("title", "Unknown"),
                    "url": paper.get("url", "#"),
                    "snippet": paper.get("abstract", "")[:300] if paper.get("abstract") else "",
                    "authors": authors,
                    "year": paper.get("year", "N/A"),
                    "citations": paper.get("citationCount", 0),
                    "source": "Semantic Scholar"
                })
        return results
    except Exception as e:
        print(f"Semantic Scholar API Error: {e}")
        return []


# --- Helper: arXiv Search ---
def search_arxiv(query, max_results=10):
    """Search preprints using arXiv API."""
    try:
        import urllib.parse
        base_url = "http://export.arxiv.org/api/query?"
        search_query = f"search_query=all:{urllib.parse.quote(query)}&start=0&max_results={max_results}"
        
        response = requests.get(base_url + search_query, timeout=10)
        response.raise_for_status()
        
        # Parse XML response
        import xml.etree.ElementTree as ET
        root = ET.fromstring(response.content)
        
        # Define namespace
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        results = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns)
            summary = entry.find('atom:summary', ns)
            link = entry.find('atom:id', ns)
            published = entry.find('atom:published', ns)
            authors = entry.findall('atom:author/atom:name', ns)
            
            results.append({
                "title": title.text.strip() if title is not None else "Unknown",
                "url": link.text.strip() if link is not None else "#",
                "snippet": summary.text.strip()[:300] if summary is not None else "",
                "authors": ", ".join([a.text for a in authors]) if authors else "Unknown",
                "published": published.text[:10] if published is not None else "N/A",
                "source": "arXiv"
            })
        
        return results
    except Exception as e:
        print(f"arXiv API Error: {e}")
        return []


# --- Structure (Groq with OpenRouter Fallback) ---
@app.route('/analyze-structure', methods=['POST'])
def analyze_paper_structure():
    data = request.get_json()
    text = data.get('text', '')

    if not text or len(text) < 50:
        return jsonify({"error": "Text is too short for analysis."}), 400

    # Strict JSON System Prompt
    system_prompt = """
    You are an expert academic reviewer with extensive experience in evaluating scholarly manuscripts across multiple disciplines. Your task is to conduct a thorough, critical analysis of the research paper text provided.

EVALUATION CRITERIA:

1. STRUCTURE (0-100):
   - Logical organization and flow of content
   - Presence and quality of essential sections (Abstract, Introduction, Methodology, Results, Discussion, Conclusion)
   - Appropriate section transitions and coherence
   - Balance between sections (no section disproportionately long/short)
   - Proper formatting of headings, subheadings, and hierarchical structure

2. TONE (0-100):
   - Academic formality and appropriateness
   - Objectivity and lack of bias
   - Consistency of voice throughout
   - Appropriate use of active vs. passive voice
   - Professional language (avoiding colloquialisms, overly casual expressions)

3. CLARITY (0-100):
   - Precision and specificity of language
   - Absence of ambiguity or vague statements
   - Sentence structure complexity (appropriate for academic audience)
   - Paragraph coherence and topic sentences
   - Effective use of definitions and explanations
   - Readability without sacrificing scholarly rigor

4. CITATIONS (0-100):
   - Adequate citation of sources throughout the paper
   - Proper attribution of ideas, data, and direct quotes
   - Currency and relevance of cited sources
   - Balance of citation types (books, journals, primary sources)
   - Consistency in citation format
   - Appropriate citation density (not over-citing or under-citing)

ANALYSIS REQUIREMENTS:

- Identify specific structural weaknesses (missing sections, poor organization, weak transitions)
- Note tone inconsistencies, inappropriate language, or bias
- Highlight unclear passages, jargon misuse, or convoluted explanations
- Flag citation issues: missing citations, outdated sources, citation format problems

- Provide actionable, specific improvement suggestions prioritized by impact
- Calculate an overall quality score (0-100) weighted across all metrics
- Generate a concise executive summary of the paper's strengths and weaknesses

OUTPUT FORMAT:

You MUST return ONLY valid JSON with NO additional text, explanations, or markdown formatting (absolutely NO ```json blocks).

Use this EXACT structure:

{
  "overallScore": number (0-100, weighted average with structure:30%, tone:20%, clarity:30%, citations:20%),
  "summary": "string (2-4 sentences summarizing the paper's overall quality, major strengths, and critical weaknesses)",
  "metrics": {
    "structure": number (0-100),
    "tone": number (0-100),
    "clarity": number (0-100),
    "citations": number (0-100)
  },
  "structureIssues": [
    "string (specific structural problems identified, e.g., 'Missing methodology section', 'Conclusion does not summarize key findings')"
  ],
  "toneIssues": [
    "string (specific tone problems, e.g., 'Uses first-person pronouns excessively', 'Contains subjective language in analysis section')"
  ],
  "clarityIssues": [
    "string (specific clarity problems, e.g., 'Paragraph 3 contains ambiguous pronoun references', 'Technical terms undefined')"
  ],
  "citationIssues": [
    "string (specific citation problems, e.g., 'Key claims in Introduction lack supporting citations', 'Inconsistent citation format')"
  ],
  "improvements": [
    {
      "section": "string (specific section name or 'General')",
      "issue": "string (clear description of the problem)",
      "suggestion": "string (specific, actionable recommendation for improvement)",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "strengths": [
    "string (notable positive aspects of the paper)"
  ]
}

IMPORTANT REMINDERS:
- Output ONLY the JSON object
- Do NOT include any markdown code blocks or formatting
- Do NOT add explanatory text before or after the JSON
- Ensure all JSON syntax is valid (proper quotes, commas, brackets)
- All string values must be properly escaped
- Numbers should be integers between 0-100
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Paper Text:\n{text[:25000]}"}
    ]

    # Try Groq first, fallback to OpenRouter if it fails
    try:
        print("[INFO] Attempting Groq API...")
        api_response = call_groq(messages)
        print("[SUCCESS] Groq API worked!")
        
        if 'choices' in api_response and len(api_response['choices']) > 0:
            content = api_response['choices'][0]['message']['content']
            content = content.replace("```json", "").replace("```", "").strip()
            return jsonify(json.loads(content))
        else:
            raise Exception("No response from Groq")
            
    except Exception as groq_error:
        print(f"[WARNING] Groq failed: {groq_error}")
        print("[INFO] Falling back to OpenRouter...")
        
        try:
            api_response = call_openrouter(messages)
            print("[SUCCESS] OpenRouter fallback worked!")
            
            if 'choices' in api_response and len(api_response['choices']) > 0:
                content = api_response['choices'][0]['message']['content']
                content = content.replace("```json", "").replace("```", "").strip()
                return jsonify(json.loads(content))
            else:
                return jsonify({"error": "No response from OpenRouter"}), 500
                
        except json.JSONDecodeError:
            return jsonify({"error": "Model response was not valid JSON."}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500


# --- Originality (Hybrid: DuckDuckGo + Semantic Scholar + arXiv) ---
@app.route('/check-originality', methods=['POST'])
def check_paper_originality():
    data = request.get_json()
    text = data.get('text', '')

    if not text or len(text) < 50:
        return jsonify({
            "isOriginal": True, 
            "score": 100, 
            "sources": [], 
            "analysisText": "Text too short.",
            "detailedResult": {
                "originalityScore": 100,
                "overallAssessment": "Original",
                "summary": "Text too short for meaningful analysis.",
                "totalMatchesFound": 0,
                "matchDetails": [],
                "suspiciousPatterns": [],
                "recommendations": []
            }
        })

    # Extract key phrases for searching (first 500 chars for better query formation)
    sample_text = text[:500]
    
    # Extract a few distinctive phrases for exact match searches
    sentences = sample_text.split('.')[:3]  # First 3 sentences
    search_queries = [s.strip() for s in sentences if len(s.strip()) > 20][:2]
    
    try:
        # Step 1: Perform searches across all sources
        all_sources = []
        
        # DuckDuckGo web search
        for query in search_queries:
            ddg_results = search_duckduckgo(query, max_results=5)
            all_sources.extend(ddg_results)
        
        # Semantic Scholar academic search
        scholar_results = search_semantic_scholar(sample_text, limit=5)
        all_sources.extend(scholar_results)
        
        # arXiv preprint search
        arxiv_results = search_arxiv(sample_text, max_results=5)
        all_sources.extend(arxiv_results)
        
        # Step 2: Deduplicate sources by URL
        unique_sources = []
        seen_urls = set()
        for source in all_sources:
            url = source.get('url', '')
            if url and url != '#' and url not in seen_urls:
                unique_sources.append(source)
                seen_urls.add(url)
        
        # Step 3: Use LLM to analyze the sources and determine plagiarism
        analysis_prompt = f"""
You are an expert plagiarism detection specialist. Analyze the provided text against the search results to determine originality.

TEXT TO CHECK:
{text[:2000]}

SEARCH RESULTS FOUND:
{json.dumps(unique_sources[:15], indent=2)}

ANALYSIS INSTRUCTIONS:
1. Compare the text against each search result
2. Identify exact matches, paraphrasing, or similar content
3. Determine if matches are legitimate citations or plagiarism
4. Calculate an originality score (0-100, where 100 is completely original)
5. Provide specific evidence for any plagiarism detected

OUTPUT FORMAT (JSON only, no markdown):
{{
  "originalityScore": number (0-100),
  "overallAssessment": "Original" | "Mostly Original" | "Questionable" | "Plagiarized",
  "summary": "string (2-3 sentences explaining the assessment)",
  "totalMatchesFound": number,
  "matchDetails": [
    {{
      "sourceUrl": "string",
      "sourceTitle": "string",
      "sourceAuthor": "string",
      "sourceDate": "string",
      "sourceType": "Academic Paper" | "Website" | "Preprint",
      "matchType": "Exact Match" | "Paraphrase" | "Similar Content",
      "matchedText": "string (text from the paper)",
      "sourceText": "string (matching text from source)",
      "matchPercentage": number (0-100),
      "severity": "High" | "Medium" | "Low",
      "location": "string (where in the paper)"
    }}
  ],
  "suspiciousPatterns": ["string (patterns that suggest plagiarism)"],
  "recommendations": [
    {{
      "issue": "string",
      "location": "string",
      "action": "string (what to do)",
      "priority": "High" | "Medium" | "Low"
    }}
  ],
  "searchQueries": {json.dumps(search_queries)},
  "confidenceLevel": "High" | "Medium" | "Low"
}}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Be thorough but fair - common academic phrases are not plagiarism
- Properly cited content is not plagiarism
- Focus on substantial matches, not trivial similarities
"""

        # Call OpenRouter for analysis
        messages = [
            {"role": "system", "content": "You are a plagiarism detection expert. Analyze text and return only valid JSON."},
            {"role": "user", "content": analysis_prompt}
        ]
        
        api_response = call_openrouter(messages, temperature=0.1)
        
        if 'choices' in api_response and len(api_response['choices']) > 0:
            content = api_response['choices'][0]['message']['content']
            # Cleanup markdown if present
            content = content.replace("```json", "").replace("```", "").strip()
            parsed_analysis = json.loads(content)
        else:
            # Fallback if LLM fails
            parsed_analysis = {
                "originalityScore": max(0, 100 - (len(unique_sources) * 15)),
                "overallAssessment": "Unknown",
                "summary": "Analysis completed with limited data.",
                "totalMatchesFound": len(unique_sources),
                "matchDetails": [],
                "suspiciousPatterns": [],
                "recommendations": [],
                "searchQueries": search_queries,
                "confidenceLevel": "Low"
            }
        
        # Step 4: Return comprehensive results
        return jsonify({
            "isOriginal": parsed_analysis.get("originalityScore", 100) > 80,
            "score": parsed_analysis.get("originalityScore", 100),
            "sources": unique_sources[:10],  # Return top 10 sources for reference
            "analysisText": parsed_analysis.get("summary", "Analysis completed."),
            "detailedResult": parsed_analysis
        })
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        # Fallback response
        return jsonify({
            "isOriginal": len(unique_sources) < 3,
            "score": max(0, 100 - (len(unique_sources) * 15)),
            "sources": unique_sources[:10],
            "analysisText": f"Found {len(unique_sources)} potential sources. Manual review recommended.",
            "detailedResult": {
                "originalityScore": max(0, 100 - (len(unique_sources) * 15)),
                "overallAssessment": "Unknown",
                "summary": "Analysis completed but detailed parsing failed.",
                "totalMatchesFound": len(unique_sources),
                "matchDetails": [],
                "suspiciousPatterns": [],
                "recommendations": []
            }
        })
    except Exception as e:
        print(f"Originality Check Error: {e}")
        return jsonify({
            "error": "Failed to perform originality check.",
            "details": str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
