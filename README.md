# 📝 Research Paper Checker

A comprehensive AI-powered tool for analyzing research papers, checking originality, and providing detailed feedback on structure, tone, clarity, and citations.

![Research Paper Checker](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🔍 **Originality Verification**
- **Multi-Source Search**: Hybrid approach using DuckDuckGo, Semantic Scholar, and arXiv
- **Academic Focus**: Specialized detection for published papers and preprints
- **Privacy-First**: Uses privacy-focused search engines (no tracking)
- **Comprehensive Analysis**: AI-powered plagiarism detection with detailed match reports

### 📊 **Structure Analysis**
- **Lightning-Fast**: Powered by Groq for ultra-fast inference
- **Comprehensive Metrics**: Evaluates structure, tone, clarity, and citations
- **Detailed Feedback**: Specific improvement suggestions with priority levels
- **Academic Standards**: Expert-level manuscript evaluation

---

## 🏗️ Architecture

### Backend (Python/Flask)
- **Framework**: Flask with CORS support
- **AI Services**:
  - **Groq**: Structure analysis (Llama 3.1 70B)
  - **OpenRouter**: Plagiarism analysis with reasoning
- **Search APIs**:
  - **DuckDuckGo**: Privacy-focused web search
  - **Semantic Scholar**: 200M+ academic papers
  - **arXiv**: 2M+ preprints in STEM fields

### Frontend (React/TypeScript)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with dark mode support

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **pnpm** (or npm)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows: `.\venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables** (`.env`):
   ```env
   # Required
   GROQ_API_KEY=your_groq_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Optional (defaults provided)
   GROQ_MODEL=llama-3.1-70b-versatile
   O_R_MODEL=tngtech/deepseek-r1t2-chimera:free
   O_R_URL=https://openrouter.ai/api/v1/chat/completions
   ALLOWED_ORIGIN=http://localhost:3000
   ```

6. **Run the backend**:
   ```bash
   python main.py
   ```
   Backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

---

## 🔑 API Keys

### Get Your API Keys

1. **Groq** (Free tier available):
   - Visit: https://console.groq.com
   - Sign up and get your API key
   - Free tier: 30 requests/min for Llama 3.1 70B

2. **OpenRouter** (Pay-as-you-go):
   - Visit: https://openrouter.ai
   - Sign up and get your API key
   - DeepSeek R1 is very affordable (~$0.001 per request)

---

## 📡 API Endpoints

### `POST /analyze-structure`
Analyzes paper structure, tone, clarity, and citations using Groq.

**Request**:
```json
{
  "text": "Your research paper content..."
}
```

**Response**:
```json
{
  "overallScore": 85,
  "summary": "The paper demonstrates strong structure...",
  "metrics": {
    "structure": 90,
    "tone": 85,
    "clarity": 80,
    "citations": 85
  },
  "improvements": [...],
  "strengths": [...]
}
```

### `POST /check-originality`
Checks paper originality using hybrid multi-source approach.

**Request**:
```json
{
  "text": "Your research paper content..."
}
```

**Response**:
```json
{
  "isOriginal": true,
  "score": 95,
  "sources": [...],
  "detailedResult": {
    "originalityScore": 95,
    "matchDetails": [...],
    "recommendations": [...]
  }
}
```

---

## 🛠️ Tech Stack

### Backend
- **Flask** - Web framework
- **Requests** - HTTP library
- **duckduckgo-search** - Privacy-focused web search
- **python-dotenv** - Environment variable management
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 🌟 Why This Stack?

### Groq for Structure Analysis
- ⚡ **Fastest inference** in the industry
- 💰 **Generous free tier**
- 🎯 **Perfect for pattern matching** tasks like structure analysis
- 📊 **Excellent JSON output** quality

### Hybrid Originality Check
- 🔒 **Privacy-first**: DuckDuckGo doesn't track searches
- 🎓 **Academic-focused**: Semantic Scholar & arXiv for research papers
- 💵 **100% Free**: No API keys required for search APIs
- 🌐 **Comprehensive**: Web + Academic + Preprints coverage

---

## 📝 License

MIT License - feel free to use this project for your own purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for researchers and academics**
