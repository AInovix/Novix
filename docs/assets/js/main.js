document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggle = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');

    // Load Content from Markdown
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Content not found');
            const markdown = await response.text();
            const html = marked.parse(markdown);
            contentArea.innerHTML = html;
            Prism.highlightAll();
            if (typeof mermaid !== 'undefined') mermaid.init();
        } catch (error) {
            contentArea.innerHTML = `<h1>Error</h1><p>Failed to load content: ${error.message}</p>`;
        }
    }

    // Sidebar Navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const mdPath = link.getAttribute('data-md');
            loadContent(mdPath);
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        document.body.classList.toggle('theme-dark', newTheme === 'dark');
        document.body.classList.toggle('theme-light', newTheme === 'light');
        localStorage.setItem('theme', newTheme);
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ theme: newTheme === 'dark' ? 'dark' : 'default' });
            mermaid.init();
        }
    });

    // Search Functionality
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        sidebarLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            link.parentElement.style.display = text.includes(query) ? 'block' : 'none';
        });
    });

    // Load Default Content
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) loadContent(activeLink.getAttribute('data-md'));
});
