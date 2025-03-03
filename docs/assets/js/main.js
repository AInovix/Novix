class DocumentationApp {
    constructor() {
        this.basePath = window.location.pathname.includes('/Novix/') 
            ? '/Novix/' 
            : '/';
        
        this.init();
    }

    init() {
        this.initTheme();
        this.setupEventListeners();
        this.loadInitialContent();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThirdPartyThemes(newTheme);
        });

        // Navigation
        document.addEventListener('click', async (e) => {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;
            
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
            
            await this.loadContent(navLink.dataset.md);
        });
    }

    async loadContent(path) {
        try {
            const fullPath = path.startsWith('../') 
                ? `${this.basePath}${path.replace('../', '')}`
                : `${this.basePath}docs/${path}`;

            const response = await fetch(fullPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            this.renderContent(markdown);
            
        } catch (error) {
            this.showError(error, fullPath);
        }
    }

    renderContent(markdown) {
        const html = marked.parse(markdown);
        document.getElementById('dynamic-content').innerHTML = html;
        
        // Highlight code blocks
        Prism.highlightAll();
        
        // Initialize Mermaid diagrams
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ 
                theme: document.documentElement.dataset.theme === 'dark' 
                    ? 'dark' 
                    : 'default',
                securityLevel: 'loose'
            });
            mermaid.run();
        }
    }

    showError(error, path) {
        document.getElementById('dynamic-content').innerHTML = `
            <div class="error">
                <h3>⚠️ Content Load Failed</h3>
                <p>${error.message}</p>
                <p>Verify file exists at:</p>
                <a href="${path}" target="_blank">${path}</a>
            </div>
        `;
    }

    updateThirdPartyThemes(theme) {
        // Update Mermaid
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ theme: theme === 'dark' ? 'dark' : 'default' });
            mermaid.run();
        }
    }

    loadInitialContent() {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) this.loadContent(activeLink.dataset.md);
        
        // Hide loader
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loader').remove();
                }, 300);
            }, 500);
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.docApp = new DocumentationApp();
});
