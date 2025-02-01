document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = `theme-${storedTheme}`;
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('theme-dark') ? 'light' : 'dark';
        document.documentElement.className = `theme-${newTheme}`;
        localStorage.setItem('theme', newTheme);
    });

    // Markdown Loader
    const loadContent = async (path) => {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('File not found');
            
            const md = await response.text();
            const converter = new showdown.Converter({
                tables: true,
                simplifiedAutoLink: true
            });
            
            document.getElementById('doc-content').innerHTML = converter.makeHtml(md);
            Prism.highlightAll();
        } catch (error) {
            document.getElementById('doc-content').innerHTML = `
                <div class="error">
                    <h2>Error Loading Content</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    };

    // Navigation
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const mdPath = link.dataset.md;
            window.history.pushState({}, '', `#${link.getAttribute('href')}`);
            loadContent(mdPath);
        });
    });

    // Load initial content
    const initialPath = window.location.hash 
        ? document.querySelector(`[href="${window.location.hash}"]`)?.dataset.md
        : 'content/getting-started/1-quick-start.md';
    
    loadContent(initialPath);
});
