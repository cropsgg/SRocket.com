// Service Worker for SRocket Web
// Enables offline functionality

const CACHE_NAME = 'srocket-web-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/simulation.html',
    '/documentation.html',
    '/about.html',
    '/css/style.css',
    '/css/home.css',
    '/css/documentation.css',
    '/css/about.css',
    '/css/dark-mode.css',
    '/css/preferences.css',
    '/js/main.js',
    '/js/simulation.js',
    '/js/graphs.js',
    '/js/grain-visualization.js',
    '/js/file-operations.js',
    '/js/documentation.js',
    '/js/preferences.js',
    '/assets/images/logo.svg',
    '/assets/images/rocket-illustration.svg',
    '/assets/images/avatar-placeholder.svg',
    '/assets/images/github-icon.svg',
    '/assets/images/html5-icon.svg',
    '/assets/images/css3-icon.svg',
    '/assets/images/javascript-icon.svg',
    '/assets/images/nodejs-icon.svg',
    '/assets/images/chartjs-icon.svg',
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom'
]; 