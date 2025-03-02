document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggle = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');

    // Load content dynamically from Markdown files
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.status}`);
            const markdown = await response.text();
            const sanitizedHTML = DOMPurify.sanitize(marked.parse(markdown));
            contentArea.innerHTML = sanitizedHTML;
            Prism.highlightAll();
            if (typeof mermaid !== 'undefined') {
                mermaid.run({
                    querySelector: '.mermaid'
                });
            }
            // Smooth scroll to top of content
            contentArea.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            contentArea.innerHTML = `<div style="color: var(--secondary); padding: 1rem;">Error loading content: ${error.message}</div>`;
        }
    }

    // Sidebar link handling
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const mdPath = link.getAttribute('data-md');
            loadContent(mdPath);
        });
    });

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        sidebarLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            const parentLi = link.closest('li');
            parentLi.style.display = text.includes(query) || query === '' ? '' : 'none';
        });
    });

    // Theme toggle persistence
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
        if (typeof mermaid !== 'undefined') {
            mermaid.update({ theme: newTheme === 'dark' ? 'dark' : 'default' });
        }
    });

    // Load initial content
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        loadContent(activeLink.getAttribute('data-md'));
    }
});
