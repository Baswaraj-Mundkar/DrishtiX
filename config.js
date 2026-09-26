// config.js
// Global configuration for DrishtiX

const CONFIG = {
    // Google Fact Check Tools API Key
    // Get yours here: https://console.cloud.google.com/
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
