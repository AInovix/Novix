async function loadContent(path) {
    try {
        // Convert relative paths for GitHub Pages
        const basePath = window.location.host.includes('github.io') 
            ? '/Novix/'  // Match your repo name
            : '/';
        
        const fullPath = `${basePath}${path}`;
        
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const md = await response.text();
        const converter = new showdown.Converter({
            tables: true,
            ghCompatibleHeaderId: true,
            simplifiedAutoLink: true
        });
        
        document.getElementById('doc-content').innerHTML = converter.makeHtml(md);
        Prism.highlightAll();
        
    } catch (error) {
        console.error('Failed to load content:', error);
        document.getElementById('doc-content').innerHTML = `
            <div class="error-alert">
                <h2>Content Loading Failed</h2>
                <p>Unable to load requested document. Please verify:</p>
                <ul>
                    <li>The file exists in the repository</li>
                    <li>You have network connectivity</li>
                    <li>GitHub Pages deployment is complete</li>
                </ul>
                <p>Technical details: ${error.message}</p>
            </div>
        `;
    }
}
