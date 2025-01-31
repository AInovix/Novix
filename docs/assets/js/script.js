document.addEventListener('DOMContentLoaded', () => {
    // Load default content
    loadContent('1-getting-started/1-quick-start-guide.md');
    
    // Handle navigation
    document.querySelectorAll('.doc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent(this.getAttribute('href'));
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });
});

async function loadContent(path) {
    try {
        const response = await fetch(path);
        const mdContent = await response.text();
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(mdContent);
        document.getElementById('content').innerHTML = htmlContent;
        Prism.highlightAll();
    } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('content').innerHTML = `
            <div class="bg-red-100 p-4 rounded-lg">
                Error loading content: ${error.message}
            </div>
        `;
    }
}
