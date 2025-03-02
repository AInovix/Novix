document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggle = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');

    // Enhanced Content Loader
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Content load failed (${response.status})`);
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            // Sanitize and render
            contentArea.innerHTML = DOMPurify.sanitize(html);
            
            // Highlight code
            Prism.highlightAll();
            
            // Init Mermaid
            if (typeof mermaid !== 'undefined') {
                mermaid.init({}, '.mermaid');
            }
        } catch (error) {
            contentArea.innerHTML = `
                <div class="error-state">
                    <h2>⚠️ Content Load Error</h2>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    // Search Functionality
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        sidebarLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            link.parentElement.style.display = text.includes(query) ? 'list-item' : 'none';
        });
    });

    // Theme Toggle with Mermaid Refresh
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                theme: newTheme === 'dark' ? 'dark' : 'default'
            });
            mermaid.init();
        }
    });

    // Rest of existing functionality..
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggle = document.getElementById('theme-toggle');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const mdPath = link.getAttribute('data-md');
            try {
                const response = await fetch(mdPath);
                if (!response.ok) throw new Error(`Failed to load ${mdPath}`);
                const markdown = await response.text();
                contentArea.innerHTML = marked.parse(markdown);
                Prism.highlightAll();
                if (typeof mermaid !== 'undefined') {
                    mermaid.init();
                }
            } catch (error) {
                contentArea.innerHTML = `<div style='color: red;'>Error loading ${mdPath}: ${error.message}</div>`;
            }
        });
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // Load initial content
    if (sidebarLinks.length > 0) {
        sidebarLinks[0].click();
    }
});
// Update theme toggle handler in main.js
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme attribute and storage
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update Mermaid if needed
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            theme: newTheme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose'
        });
        mermaid.init();
    }
    
    // Force CSS repaint for transitions
    document.documentElement.style.overflowX = 'hidden';
    setTimeout(() => {
        document.documentElement.style.overflowX = '';
    }, 10);
});
