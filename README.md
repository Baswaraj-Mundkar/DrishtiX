# DrishtiX

**A student-built misinformation-awareness and media-literacy web application.**

DrishtiX provides educational resources, rule-based text screening, a report-submission prototype, a demonstration map, and interactive quizzes in eight Indian languages.

> **Important limitation:** DrishtiX is an academic prototype. Its text screening uses simple rules and pattern indicators; it does not verify whether a claim is true or false, and its scores are not probabilities. Always verify claims using original sources and independent fact-checkers.

## Features

- **Rule-based claim screening:** highlights sensational wording, manipulation phrases, text-quality signals, and basic source-domain indicators. It deliberately does not issue a TRUE/FALSE verdict.
- **Fact-checking resources:** links to independent fact-checking organizations for manual verification.
- **Report submission prototype:** accepts a headline, platform, context, optional source URL, and optional location.
- **Demonstration map:** displays illustrative sample reports and locally stored demo submissions. Markers are not independently verified findings.
- **Media-literacy quiz:** randomized questions about deepfakes, phishing, clickbait, confirmation bias, and the SIFT method.
- **Multilingual interface:** English, Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati, and Bengali.

## Technology

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Local demo backend:** Node.js built-in HTTP server (no third-party runtime dependencies)
- **Local report storage:** JSON file stored outside the repository in the current user's home directory
- **Maps:** Leaflet and OpenStreetMap
- **Internationalization:** custom client-side translation files

## Run locally

### Requirements

- Node.js 18 or newer
- npm

### Setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/Baswaraj-Mundkar/DrishtiX.git
   cd DrishtiX
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create the local environment file:

   **Windows PowerShell**
   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux**
   ```bash
   cp .env.example .env
   ```

4. Start the local demo server:

   ```bash
   npm start
   ```

5. Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

The local report API is enabled by the example `.env` file. The server binds to `127.0.0.1` only. Report data is written to `~/.drishtix/reports.json` (or the equivalent home directory on Windows), not into the Git repository.

## Authentication and deployment limitations

- The login page only switches between local demo roles. It is **not authentication**.
- The admin view is a UI demonstration, not a protected moderation system.
- The report API is intentionally disabled when `NODE_ENV=production` and is designed only for local demonstrations.
- The project does not provide production user accounts, access control, secure public report storage, or a production deployment backend.
- Do not collect real personal information, sensitive reports, or precise location data using this prototype.
- A public static deployment can display the frontend, but report persistence and admin moderation are not supported there.

## Fact-checking limitations

The screening page uses deterministic text heuristics. These can produce false positives and false negatives and cannot establish factual accuracy. The optional Google Fact Check Tools integration has been removed from browser code; never put an API key in `config.js`, HTML, or any other client-delivered file. A future integration must use a properly secured server-side endpoint.

## Security controls in this repository

- The demo API is opt-in, local-only, and disabled in production mode.
- No permissive CORS policy is enabled.
- Request bodies have a size limit and report fields are validated against length, platform, URL-scheme, and coordinate constraints.
- Report data is stored outside the public web root with restrictive local file permissions.
- API requests have basic in-memory rate limits and same-origin checks.
- Dynamic report content is escaped or inserted using text nodes before display.
- Automated tests, JavaScript syntax checks, npm audit, and Dependabot updates are configured.

These controls reduce risk for a local academic demonstration; they do not make this application production-ready.

## Development checks

Run the available checks:

```bash
npm test
npm run check
npm audit --audit-level=high
```

GitHub Actions runs the test, syntax, and dependency-audit checks for pushes and pull requests.

## Project structure

```text
DrishtiX/
├── assets/                  # Illustrations and team images
├── locales/                 # Eight language files
├── test/                    # Node.js validation tests
├── .env.example             # Safe local configuration template
├── .github/
│   ├── dependabot.yml       # Dependency update schedule
│   └── workflows/ci.yml     # Tests and security checks
├── checker.html             # Rule-based claim screening
├── dashboard.html           # Local demo reports dashboard
├── index.html               # Homepage and demonstration map
├── login.html               # Local demo role selector (not authentication)
├── report.html              # Report submission form
├── server.js                # Local-only Node.js HTTP API
├── config.js                # Public, non-secret site configuration
├── script.js                # Frontend interactions
└── package.json             # Project scripts and dependencies
```

## Academic attribution

- **Institution:** Pimpri Chinchwad College of Engineering & Research (PCCOER), Pune
- **Project Teacher:** Ms. Bharati Vasant Patange
- **Project Guide:** Miss. Sneha Mane
- **Project Team:**
  - Baswaraj Mundkar — Team Leader
  - Rambhau Jadhav — Frontend Developer
  - Rohit Bharti — Research Analyst
  - Satyajeet Gajbhar — Data and Testing

## License

No license file is currently provided. Do not assume that the code or assets may be reused or redistributed without permission from the project contributors.
