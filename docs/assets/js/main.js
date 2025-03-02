// Add theme initialization at the top
document.documentElement.setAttribute('data-theme', 
    localStorage.getItem('theme') || 'dark');

class ThemeController {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
        console.log('ThemeController initialized with:', this.theme);
        
        // Initialize theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Force CSS reflow
            document.body.offsetHeight;
            this.updateThirdPartyThemes();
            console.log('Theme toggled to:', newTheme);
        });
    }

    updateThirdPartyThemes() {
        // Update Prism.js theme
        const prismTheme = this.theme === 'dark' ? 'prism-okaidia' : 'prism';
        document.querySelector('#prism-theme').href = 
            `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${prismTheme}.min.css`;
        console.log('Prism theme updated to:', prismTheme);

        // Update Mermaid.js theme
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: this.theme === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose'
            });
            mermaid.run();
            console.log('Mermaid theme updated to:', this.theme);
        }
    }
}

class DocumentationApp {
    constructor() {
        this.themeController = new ThemeController();
        this.cache = new Map();
        this.contentArea = document.getElementById('dynamic-content');
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.handleInitialLoad();
        this.setupKeyboardNavigation();
    }

    registerServiceWorker() {
        // Comment out Service Worker registration since /sw.js doesn't exist
        /*
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.error('SW registration failed:', err));
        }
        */
        console.log('Service Worker registration skipped (file not present)');
    }

    setupEventListeners() {
        // Mobile menu
        document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
            console.log('Mobile menu toggled');
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Navigation
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && !-navLink.href.startsWith("http")) this.handleNavigation(navLink);
        });

        // History
        window.addEventListener('popstate', (e) => {
            const path = e.state ? e.state.path : 'README.md'; // Fallback to default
            this.loadContent(path, false);
        });

        // Loader handler
        window.addEventListener('load', () => {
            console.log('Window loaded, hiding initial loader');
            const loader = document.getElementById('loader');
            setTimeout(() => {
                loader.style.opacity = '0';
                document.getElementById('app').classList.add('loaded');
                setTimeout(() => {
                    loader.remove();
                    console.log('Initial loader removed');
                }, 300);
            }, 500);
        });
    }

    async handleNavigation(link) {
        const path = link.dataset.md;
        if (!path) {
            console.error('No data-md attribute found on nav-link:', link);
            return;
        }
        this.showLoader();
        
        history.pushState({ path }, '', path);
        
        await this.loadContent(path);
        this.updateActiveState(link);
        this.hideLoader();
    }

    async loadContent(path, checkCache = true) {
        if (!path) {
            console.error('loadContent called with undefined path');
            this.contentArea.innerHTML = `
                <div class="error">
                    <h3>⚠️ Content Unavailable</h3>
                    <p>No path provided</p>
                </div>
            `;
            return;
        }

        try {
            if (checkCache && this.cache.has(path)) {
                return this.renderContent(this.cache.get(path));
            }

            // Add base path for GitHub Pages
            const basePath = window.location.pathname.includes('/Novix/') 
                ? '/Novix/' 
                : '/';
            const fullPath = `${basePath}${path}`;
            
            // Add content type header
            const response = await fetch(fullPath, {
                headers: {
                    'Accept': 'text/markdown'
                }
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const markdown = await response.text();
            
            // Verify valid markdown content
            if (markdown.startsWith('<!DOCTYPE html')) {
                throw new Error('Received HTML instead of Markdown');
            }
            
            this.cache.set(path, markdown);
            this.contentArea.innerHTML = marked.parse(markdown);
            Prism.highlightAll();
            console.log('Content loaded from:', fullPath);
            
        } catch (error) {
            console.error('Loading error:', error);
            this.contentArea.innerHTML = `
                <div class="error">
                    <h3>⚠️ Content Unavailable</h3>
                    <p>${error.message}</p>
                    <p>Please verify the file exists at: <code>${path}</code></p>
                </div>
            `;
        }
    }

    renderContent(markdown) {
        const html = marked.parse(markdown);
        this.contentArea.innerHTML = DOMPurify.sanitize(html);
        
        // Post-render tasks
        Prism.highlightAll();
        this.themeController.updateThirdPartyThemes();
    }

    handleSearch(query) {
        const results = this.searchIndex(query);
        const resultsContainer = document.getElementById('search-results');
        
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" data-md="${result.path}">
                <h4>${result.title}</h4>
                <p>${result.excerpt}</p>
            </div>
        `).join('');
        
        resultsContainer.style.display = results.length ? 'block' : 'none';
    }

    searchIndex(query) {
        return Array.from(this.cache.entries()).map(([path, content]) => {
            const titleMatch = content.match(/#{1,2}\s+(.+)/);
            return {
                path,
                title: titleMatch ? titleMatch[1] : 'Untitled',
                excerpt: content.substring(0, 150),
                score: this.calculateSearchScore(content, query)
            };
        }).filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);
    }

    calculateSearchScore(content, query) {
        const cleanContent = content.toLowerCase();
        const cleanQuery = query.toLowerCase();
        let score = 0;

        if (cleanContent.includes(cleanQuery)) score += 50;
        if (cleanContent.startsWith(`# ${cleanQuery}`)) score += 100;
        
        return score;
    }

    setupKeyboardNavigation() {
        let focusedIndex = -1;
        const links = Array.from(document.querySelectorAll('.nav-link'));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                focusedIndex = Math.min(focusedIndex + 1, links.length - 1);
                links[focusedIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                focusedIndex = Math.max(focusedIndex - 1, 0);
                links[focusedIndex]?.focus();
            } else if (e.key === 'Enter' && focusedIndex >= 0) {
                links[focusedIndex].click();
            }
        });
    }

    showLoader() {
        document.getElementById('content-loader').style.display = 'block';
    }

    hideLoader() {
        document.getElementById('content-loader').style.display = 'none';
    }

    showError(error) {
        this.contentArea.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Loading Error</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Reload Page</button>
            </div>
        `;
    }

    updateActiveState(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link === activeLink);
        });
    }

    handleInitialLoad() {
        if (window.location.pathname === '/' || window.location.pathname === '/Novix/') {
            // Load default content if at root
            const defaultLink = document.querySelector('.nav-link.active');
            if (defaultLink) {
                this.loadContent(defaultLink.dataset.md);
            } else {
                console.warn('No active nav-link found for initial load');
            }
        } else if (window.location.pathname.startsWith('/Novix/')) {
            const path = window.location.pathname.replace('/Novix/', '');
            this.loadContent(path);
        } else {
            console.warn('Unexpected pathname, no initial load:', window.location.pathname);
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.docApp = new DocumentationApp();
    console.log('DocumentationApp initialized');
});
