document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggle = document.getElementById('theme-toggle');

    // Dynamic content loading
    sidebarLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const mdPath = link.getAttribute('data-md');
            try {
                const response = await fetch(mdPath);
                if (!response.ok) {
                    throw new Error(`Failed to load ${mdPath}: ${response.status}`);
                }
                const markdown = await response.text();
                contentArea.innerHTML = marked.parse(markdown);
                Prism.highlightAll(); // Highlight code blocks
                if (typeof mermaid !== 'undefined') {
                    mermaid.init(); // Initialize Mermaid diagrams
                }
            } catch (error) {
                contentArea.innerHTML = `<p>Error loading content: ${error.message}</p>`;
            }
        });
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});
