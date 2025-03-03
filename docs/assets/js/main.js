document.addEventListener('DOMContentLoaded', () => {
    const REPO_OWNER = 'AInovix';
    const REPO_NAME = 'Novix';
    const BRANCH = 'main';

    async function loadContent(path) {
        try {
            const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`;
            const response = await fetch(rawUrl);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            document.getElementById('dynamic-content').innerHTML = marked.parse(markdown);
            Prism.highlightAll();
            
        } catch (error) {
            document.getElementById('dynamic-content').innerHTML = `
                <div class="error">
                    <h3>⚠️ Content Load Failed</h3>
                    <p>${error.message}</p>
                    <p>Verify file exists at:</p>
                    <a href="https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${path}" 
                       target="_blank">
                        Open in GitHub Repository
                    </a>
                </div>
            `;
        }
    }

    // Navigation handler remains the same
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadContent(link.dataset.md);
        });
    });

    // Initial load
    loadContent('README.md');
});
