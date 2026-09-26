// config.js
// Global configuration for DrishtiX

const CONFIG = {
    // Google Fact Check Tools API Key
    // SECURITY NOTE: Never commit your real API key to a public repository!
    // Get yours here: https://console.cloud.google.com/
    // If left empty (""), the platform automatically falls back to internal heuristic analysis.
    GOOGLE_API_KEY: "",

    // Site Metadata
    SITE_NAME: "DrishtiX",
    VERSION: "1.2.0",
    ACADEMIC_AFFILIATION: "PCCOER Pune"
};

// Export if in a module environment, though we use global scope for simple script tags
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
