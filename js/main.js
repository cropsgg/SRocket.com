document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');
    
    // Check for saved preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    if (darkModeEnabled) {
        darkModeStylesheet.disabled = false;
        document.body.classList.add('dark-mode');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            if (darkModeStylesheet.disabled) {
                darkModeStylesheet.disabled = false;
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
                darkModeToggle.innerHTML = '<span class="icon">☀️</span>';
            } else {
                darkModeStylesheet.disabled = true;
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
                darkModeToggle.innerHTML = '<span class="icon">🌙</span>';
            }
        });
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
} 