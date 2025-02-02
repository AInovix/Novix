document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");
    const themeToggle = document.getElementById("theme-toggle");
    let currentMermaidElements = [];

    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default'
    });

    // Theme Management
    const setTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update Prism theme
        const prismTheme = isDark ? 
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css' :
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css';
        document.getElementById('prism-theme').href = prismTheme;
        
        // Re-render mermaid with new theme
        mermaid.initialize({ theme: isDark ? 'dark' : 'default' });
        currentMermaidElements.forEach(el => mermaid.init(undefined, el));
    };

    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        setTheme(isDark);
    });

    // Load initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme === 'dark');

// Replace the existing loadContent function with this:
const loadContent = async (filePath) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const markdown = await response.text();
        contentArea.innerHTML = marked.parse(markdown);
        
        // Process Mermaid diagrams
        const mermaidContainers = contentArea.querySelectorAll('pre code.language-mermaid');
        mermaidContainers.forEach(container => {
            const diagram = container.textContent.trim();
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = diagram;
            container.parentNode.replaceWith(mermaidDiv);
        });

        // Initialize Mermaid with proper theme
        mermaid.initialize({
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default',
            securityLevel: 'loose',
            startOnLoad: false
        });
        mermaid.init(undefined, contentArea.querySelectorAll('.mermaid'));
        
        // Syntax highlighting
        Prism.highlightAll();

    } catch (error) {
        contentArea.innerHTML = `
            <div class="error-message">
                <h3>📄 Content Loading Failed</h3>
                <p><strong>Path:</strong> ${filePath}</p>
                <p><strong>Error:</strong> ${error.message}</p>
            </div>
        `;
        console.error('Error:', error);
    }
};
    
    // Sidebar Navigation
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = link.dataset.md;
            history.pushState({}, '', window.location.pathname);
            loadContent(filePath);
        });
    });

    // Load initial content
    loadContent('README.md');
});
