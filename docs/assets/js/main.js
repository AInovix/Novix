document.addEventListener('DOMContentLoaded', () => {
    const basePath = window.location.host.includes('github.io') 
        ? '/Novix/' 
        : '/';

    async function loadContent(path) {
        try {
            const fullPath = `${basePath}${path}`;
            const response = await fetch(fullPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            document.getElementById('dynamic-content').innerHTML = html;
            
            Prism.highlightAll();
            if (typeof mermaid !== 'undefined') {
                mermaid.initialize({ 
                    theme: document.documentElement.dataset.theme === 'dark' 
                        ? 'dark' 
                        : 'default',
                    securityLevel: 'loose'
                });
                mermaid.run();
            }
        } catch (error) {
            document.getElementById('dynamic-content').innerHTML = `
                <div class="error">
                    <h3>⚠️ Content Load Error</h3>
                    <p>${error.message}</p>
                    <p>Path: ${path}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadContent(link.dataset.md);
        });
    });

    // Load initial content
    loadContent(document.querySelector('.sidebar-link.active').dataset.md);
});
