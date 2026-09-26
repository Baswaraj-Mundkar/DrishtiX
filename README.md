# DrishtiX 🛡️
> **Social Media & Fake News Awareness Platform**  
> Empowering digital citizens through AI-powered heuristics, community fact-checking, and interactive media literacy.

---

## 📌 Overview

**DrishtiX** is an open-source, community-driven social media and fake news awareness platform. Designed to combat misinformation, disinformation, and digital scams, DrishtiX combines multi-layer claim verification, crowdsourced reporting, geospatial hotspot mapping, and gamified educational modules.

The platform is designed to function seamlessly out-of-the-box with an internal heuristic analysis engine, with optional live fact-checking integrations via the Google Fact Check Tools API.

---

## ✨ Features

- **🔍 Multi-Layer Claim Verification Engine**
  - Analyzes viral headlines and claims across 5 dimensions: sensational pattern detection, quality & structure metrics, viral pressure triggers, source credibility, and external fact-check databases.
  - Includes a standalone, offline **AI Heuristic Engine** that evaluates claims without requiring external API keys.
  - Supports live external verification via the **Google Fact Check Tools API**.
- **📍 Geospatial Misinformation Heatmap**
  - Visualizes reported misinformation trends and verification statuses (Verified True, Verified Fake, Pending) on an interactive Leaflet map across regions.
- **📢 Crowdsourced Fake News Reporting**
  - Allows citizens to submit suspicious posts, screenshots, WhatsApp forwards, and URLs for review and analysis.
- **🎮 Interactive Media Literacy Quiz**
  - 50+ scenario-based questions covering deepfakes, phishing, echo chambers, confirmation bias, clickbait, and the **SIFT** verification method (*Stop, Investigate source, Find better coverage, Trace claims*).
- **🌐 Multilingual Support (i18n)**
  - Fully localized across 8 Indian languages: English, Hindi (हिंदी), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), and Bengali (বাংলা).
- **🛡️ Admin & Moderation Simulator**
  - Educational simulation allowing users and students to experience content moderation workflows firsthand.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom design system, glassmorphism, responsive UI), Vanilla JavaScript (ES6+), Leaflet.js (OpenStreetMap)
- **Backend**: Node.js, Express.js
- **Database / Storage**: Spreadsheet-driven persistence (`reports.xlsx` via SheetJS / `xlsx`)
- **Internationalization**: Custom client-side i18n engine with JSON locale definitions
- **APIs (Optional)**: Google Fact Check Tools API

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (bundled with Node.js)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Baswaraj-Mundkar/DrishtiX.git
   cd DrishtiX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt, use `copy .env.example .env`)*

4. **Start the local server:**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   Navigate to [http://localhost:8000](http://localhost:8000)

---

## ⚙️ Configuration & API Setup

### Environment Variables (`.env`)

The project uses `.env` for local configuration:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Local server port | `8000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `GOOGLE_API_KEY` | Google Fact Check Tools API key *(Optional)* | `""` |

### Setting up Google Fact Check Tools API (Optional)

DrishtiX works **completely offline** using its built-in heuristic scoring engine. If you wish to enable live cross-referencing against Google's fact-checking database:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Google Cloud Project (or select an existing one).
3. Navigate to **APIs & Services > Library** and enable **Fact Check Tools API**.
4. Navigate to **APIs & Services > Credentials** and click **Create Credentials > API Key**.
5. **Restrict your API key**: Under *API restrictions*, restrict the key to only "Fact Check Tools API". Under *Application restrictions*, set HTTP referrers (e.g., `http://localhost:8000/*` or your production domain).
6. Set your key in `config.js` (`CONFIG.GOOGLE_API_KEY`) or `.env`.

> [!NOTE]
> If `GOOGLE_API_KEY` is left blank, the application automatically falls back to heuristic analysis without throwing errors or breaking UI functionality.

---

## 🔒 Security Best Practices

- **Never commit secrets:** Never commit `.env`, API keys, tokens, or credential files to Git.
- **Client-Side API Exposure:** Direct calls to third-party APIs from client-side scripts expose the key in browser network traffic. If deploying DrishtiX to production with a real Google API key, ensure:
  1. The API key has strict HTTP referrer restrictions enabled in Google Cloud Console.
  2. For production environments, route API requests through a backend server endpoint (reverse proxy) so keys remain securely on the server.
- **Git Hygiene:** Verify `.gitignore` is present and active before staging commits.

---

## 📂 Project Structure

```text
DrishtiX/
├── assets/                  # SVG illustrations and iconography
├── locales/                 # i18n JSON translations (en, hi, mr, ta, te, kn, gu, bn)
├── .env.example             # Safe environment variable template
├── .gitattributes           # Git line ending normalization
├── .gitignore               # Ignored files, dependencies, and caches
├── checker.html             # Live Fact-Checker & AI Heuristic Analyzer
├── config.js                # Public frontend configuration (metadata, fallback settings)
├── dashboard.html           # Verification Dashboard & Hotspot Summary
├── examples.html            # Real-world Case Studies & Misinformation Types
├── index.html               # Homepage, Mission Statement & Team
├── learn.html               # SIFT Method, Critical Thinking & Media Glossary
├── login.html               # Simulated Admin / User authentication
├── package.json             # Node dependencies and scripts
├── package-lock.json        # Dependency lock file
├── quiz.html                # Gamified Misinformation Literacy Quiz
├── quiz_engine.js           # Quiz evaluation and score state engine
├── report.html              # Crowdsourced Misinformation Report Submission
├── reports.xlsx             # Sanitized initial dataset for demo reports
├── script.js                # Core frontend controller (Map, i18n binding, UI)
├── server.js                # Express backend & Excel report API
└── style.css                # Global stylesheet & design system
```

---

## 👥 Academic Attribution & Credits

- **Institution**: Pimpri Chinchwad College of Engineering & Research (PCCOER), Pune
- **Mentorship & Guidance**:
  - Ms. Bharati Vasant Patange (Project Teacher)
  - Miss. Sneha Mane (Project Guide)
- **Project Team**:
  - Baswaraj Mundkar (Team Leader & Full Stack Developer)
  - Rambhau Jadhav (Frontend Developer)
  - Rohit Bharti (Research Analyst)
  - Satyajeet Gajbhar (Data & Testing)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
