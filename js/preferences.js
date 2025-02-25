// Update in preferences.js
// Change all localStorage keys from openmotor_ to srocket_

// Helper function to get preference from localStorage
function getPreference(key, defaultValue) {
    const value = localStorage.getItem(`srocket_${key}`);
    
    if (value === null) {
        return defaultValue;
    }
    
    try {
        return JSON.parse(value);
    } catch (e) {
        return defaultValue;
    }
}

// Helper function to save preference to localStorage
function savePreference(key, value) {
    localStorage.setItem(`srocket_${key}`, JSON.stringify(value));
} 