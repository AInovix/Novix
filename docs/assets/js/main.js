document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    const themeToggle = document.getElementById('theme-toggle');

    // Debugging: Confirm script loading
    console.log('main.js loaded');

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    console.log('Theme initialized to:', savedTheme);

    // Loader handler
    window.addEventListener('load', () => {
        console.log('Window loaded, hiding loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            app.classList.add('loaded');
            setTimeout(() => {
                loader.remove();
                console.log('Loader removed');
            }, 300);
        }, 500);
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        console.log('Theme toggled to:', newTheme);
    });

    // Improved navigation handler with event delegation
    document.addEventListener('click', async (e) => {
        const navLink = e.target.closest('.nav-link:not([href^="http"])');
        if (!navLink) return;

        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        navLink.classList.add('active');
        
        try {
            const path = navLink.dataset.md;
            console.log('Fetching content from:', path);
            const response = await fetch(path);
            
            if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            // Update content area
            document.getElementById('dynamic-content').innerHTML = html;
            console.log('Content loaded for:', path);
            
            // Highlight code blocks
            Prism.highlightAll();
            
            // Initialize Mermaid diagrams
            if (window.mermaid) {
                mermaid.initialize({ 
                    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
                    securityLevel: 'loose'
                });
                mermaid.run();
                console.log('Mermaid diagrams rendered');
            }
        } catch (error) {
            console.error('Navigation error:', error);
            document.getElementById('dynamic-content').innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Content Load Failed</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    });

    // Initial load
    const initialLink = document.querySelector('.nav-link.active');
    if (initialLink) {
        console.log('Initial load triggered for:', initialLink.dataset.md);
        initialLink.click();
    } else {
        console.warn('No .nav-link.active found for initial load');
    }
});
