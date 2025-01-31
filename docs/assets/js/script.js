// Handle documentation navigation
document.querySelectorAll('.doc-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        loadContent(path);
    });
});

async function loadContent(path) {
    try {
        const response = await fetch(path);
        const content = await response.text();
        document.getElementById('content').innerHTML = 
            new showdown.Converter().makeHtml(content);
        Prism.highlightAll();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Initialize Markdown parser and code highlighter
const showdown = require('showdown');
const Prism = require('prismjs');
