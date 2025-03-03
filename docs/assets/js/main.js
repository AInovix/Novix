// docs/assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = window.location.origin + '/Novix/'; // Direct GitHub Pages URL
    
    async function loadContent(path) {
        try {
            const fullUrl = `${BASE_URL}${path}`;
            console.log('Fetching:', fullUrl);
            
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            document.getElementById('dynamic-content').innerHTML = marked.parse(markdown);
            Prism.highlightAll();
            
        } catch (error) {
            document.getElementById('dynamic-content').innerHTML = `
                <div class="error">
                    <h3>⚠️ Error Loading Content</h3>
                    <p>${error.message}</p>
                    <p>Verify file exists at:</p>
                    <a href="${BASE_URL}${path}" target="_blank">
                        Try direct link
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
    loadContent('README.md');
});
