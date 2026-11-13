// Public, non-secret site configuration for DrishtiX.
// Never place API keys, passwords, or tokens in browser-delivered files.

const CONFIG = {
    SITE_NAME: "DrishtiX",
    VERSION: "1.2.0",
    ACADEMIC_AFFILIATION: "PCCOER Pune"
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
