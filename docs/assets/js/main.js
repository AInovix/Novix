document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('dynamic-content');
    const searchBar = document.getElementById('search-bar');
    const themeToggle = document.getElementById('theme-toggle');
    const loader = document.getElementById('loader');

    // Hide loader when page loads
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    });

    // Function to load content
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Failed to load');
            const markdown = await response.text();
            const html = marked.parse(markdown);
            contentArea.innerHTML = html;
            Prism.highlightAll();
            if (typeof mermaid !== 'undefined') {
                mermaid.run();
            }
        } catch (error) {
            contentArea.innerHTML = `<p style="color: red;">Error loading content: ${error.message}</p>`;
        }
    }

    // Nav link click handler
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const path = link.getAttribute('data-md');
            await loadContent(path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Search bar functionality
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.nav-list li').forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(query) || query === '' ? '' : 'none';
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isDark = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Load initial content
    const firstLink = document.querySelector('.nav-link.active');
    if (firstLink) {
        loadContent(firstLink.getAttribute('data-md'));
    }
});
