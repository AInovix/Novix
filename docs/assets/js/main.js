document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Loader handler
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            app.classList.add('loaded');
            setTimeout(() => loader.remove(), 300);
        }, 500);
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Content loader
    async function loadMarkdown(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            return `## Error\nUnable to load content: ${error.message}`;
        }
    }

    // Navigation handler
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const content = await loadMarkdown(link.dataset.md);
            document.getElementById('dynamic-content').innerHTML = marked.parse(content);
            Prism.highlightAll();
            mermaid.initialize({ theme: document.documentElement.dataset.theme });
            mermaid.run();
        });
    });

    // Initial load
    const initialLink = document.querySelector('.nav-link.active');
    if (initialLink) initialLink.click();
});
