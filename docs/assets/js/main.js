document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    const contentArea = document.getElementById('dynamic-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');

    // Hide loader and show app content
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            app.classList.add('loaded');
        }, 300);
    });

    // Function to load content dynamically
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Content not found');
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
            Prism.highlightAll(); // Syntax highlighting
            if (typeof mermaid !== 'undefined') mermaid.run(); // Diagrams
        } catch (error) {
            contentArea.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadContent(link.getAttribute('data-md'));
        });
    });

    // Load initial content
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) loadContent(activeLink.getAttribute('data-md'));

    // Theme toggle (basic dark/light switch)
    let isDark = true;
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.style.backgroundColor = isDark ? '#121212' : '#ffffff';
        document.body.style.color = isDark ? '#e0e0e0' : '#121212';
    });
});
