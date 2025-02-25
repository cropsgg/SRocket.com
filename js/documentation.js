document.addEventListener('DOMContentLoaded', function() {
    // Documentation navigation
    const docLinks = document.querySelectorAll('.doc-nav a');
    
    docLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            docLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // If on mobile, scroll to content
            if (window.innerWidth < 992) {
                const contentElement = document.querySelector('.content');
                if (contentElement) {
                    setTimeout(() => {
                        contentElement.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('doc-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Simple search implementation - highlight matching links
            docLinks.forEach(link => {
                const linkText = link.textContent.toLowerCase();
                
                if (searchTerm === '' || linkText.includes(searchTerm)) {
                    link.style.display = 'block';
                    
                    if (linkText.includes(searchTerm) && searchTerm !== '') {
                        link.style.backgroundColor = 'rgba(102, 204, 255, 0.2)';
                    } else {
                        link.style.backgroundColor = '';
                    }
                } else {
                    link.style.display = 'none';
                }
            });
            
            // Show/hide section headers based on visible links
            const sections = document.querySelectorAll('.doc-nav h3');
            
            sections.forEach(section => {
                const nextSection = section.nextElementSibling;
                if (nextSection && nextSection.tagName === 'UL') {
                    const hasVisibleLinks = Array.from(nextSection.querySelectorAll('a')).some(
                        link => link.style.display !== 'none'
                    );
                    
                    section.style.display = hasVisibleLinks ? 'block' : 'none';
                }
            });
        });
    }
}); 