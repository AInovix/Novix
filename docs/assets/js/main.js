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
                if (typeof mermaid !== 'undefined') mermaid.init();
            } catch (error) {
                contentArea.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});
