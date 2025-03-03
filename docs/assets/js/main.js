document.addEventListener('DOMContentLoaded', () => {
    const REPO_NAME = 'Novix'; // Must match GitHub repository name exactly
    const BASE_PATH = `/${REPO_NAME}/`;

    async function loadContent(path) {
        try {
            const fullPath = `${BASE_PATH}${path}`.replace(/\/\//g, '/');
            console.log('Loading:', fullPath); // Debug log
            
            const response = await fetch(fullPath);
            if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            
            const markdown = await response.text();
            document.getElementById('dynamic-content').innerHTML = marked.parse(markdown);
            Prism.highlightAll();
            
        } catch (error) {
            console.error('Load error:', error);
            document.getElementById('dynamic-content').innerHTML = `
                <div class="error">
                    <h3>⚠️ Content Load Failed</h3>
                    <p>${error.message}</p>
                    <p>Verify file exists at:</p>
                    <a href="https://github.com/AInovix/${REPO_NAME}/blob/main/${path}" 
                       target="_blank">
                        Check file on GitHub
                    </a>
                </div>
            `;
        }
    }

    // Navigation handler
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadContent(link.dataset.md);
        });
    });

    // Initial load
    loadContent('docs/1-getting-started/1-quick-start-guide.md');
});
