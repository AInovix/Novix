document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    const themeToggle = document.getElementById('theme-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('dynamic-content');
    
    console.log('DOM fully loaded, script running');
    console.log('Found', navLinks.length, 'nav-link elements');

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    console.log('Initialized theme:', savedTheme);

    // Loader handler
    window.addEventListener('load', () => {
        console.log('Window loaded, starting loader fade-out');
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
        console.log('Theme switched to:', newTheme);
    });

    // Content loader
    async function loadMarkdown(path) {
        console.log('Attempting to load Markdown from:', path);
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const markdown = await response.text();
            console.log('Successfully loaded content from:', path);
            return markdown;
        } catch (error) {
            console.error('Failed to load content:', error.message);
            return `## Error\nUnable to load content: ${error.message}`;
        }
    }

    // Navigation handler
    navLinks.forEach((link, index) => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log(`Nav link ${index + 1} clicked:`, link.dataset.md);
            const content = await loadMarkdown(link.dataset.md);
            contentArea.innerHTML = marked.parse(content);
            Prism.highlightAll();
            mermaid.initialize({ theme: document.documentElement.dataset.theme });
            mermaid.run();
            console.log('Content rendered for:', link.dataset.md);
        });
    });

    // Initial load
    const initialLink = document.querySelector('.nav-link.active');
    if (initialLink) {
        console.log('Triggering initial load for:', initialLink.dataset.md);
        initialLink.click();
    } else {
        console.warn('No initial nav-link with .active class found');
    }
});
