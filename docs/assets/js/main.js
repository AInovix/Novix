// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateMermaidTheme(theme);
};

const updateMermaidTheme = (theme) => {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose'
        });
        mermaid.run();
    }
};

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Content Loader
const loadContent = async (path) => {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        document.getElementById('dynamic-content').innerHTML = html;
        Prism.highlightAll();
        updateMermaidTheme(document.documentElement.dataset.theme);
        
    } catch (error) {
        document.getElementById('dynamic-content').innerHTML = `
            <div class="error">
                <h3>⚠️ Content Load Failed</h3>
                <p>${error.message}</p>
                <p>Tried loading: <code>${path}</code></p>
                <button onclick="window.location.reload()">⟳ Refresh Page</button>
            </div>
        `;
    }
};

// Navigation Handling
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        loadContent(link.dataset.md);
    });
});

// Mobile Menu Toggle
const sidebar = document.querySelector('.sidebar');
document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    if (e.target.closest('.sidebar') || e.target === themeToggle) return;
    sidebar.classList.remove('active');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Load initial content
    const activeLink = document.querySelector('.sidebar-link.active');
    if (activeLink) loadContent(activeLink.dataset.md);
    
    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.transition = 'opacity 0.3s';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
});
