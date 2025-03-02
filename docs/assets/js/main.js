const loader = document.getElementById('loader');
const contentArea = document.getElementById('dynamic-content');
const navLinks = document.querySelectorAll('.nav-link');

// Hide loader when page loads
window.addEventListener('load', () => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
});

// Load content dynamically
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
