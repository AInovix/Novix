document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");

    // Function to load markdown content
    const loadMarkdown = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const markdown = await response.text();
            
            // Parse markdown and apply syntax highlighting
            contentArea.innerHTML = marked.parse(markdown);
            
            // Initialize Prism.js for code blocks
            Prism.highlightAllUnder(contentArea, false, () => {
                console.log('Syntax highlighting applied');
            });

        } catch (error) {
            contentArea.innerHTML = `
                <div class="error-message">
                    <h3>📄 Content Loading Failed</h3>
                    <p><strong>Path:</strong> ${filePath}</p>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Please verify:</p>
                    <ul>
                        <li>File exists at specified path</li>
                        <li>Server permissions allow file access</li>
                        <li>Markdown file is properly formatted</li>
                    </ul>
                </div>
            `;
            console.error('Loading error:', error);
        }
    };

    // Click handlers with better history management
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = link.dataset.md.replace(/ /g, '%20');
            history.pushState({ path: filePath }, '', window.location.pathname);
            loadMarkdown(filePath);
        });
    });

    // Handle browser navigation
    window.addEventListener('popstate', (e) => {
        if (e.state?.path) {
            loadMarkdown(e.state.path);
        }
    });

    // Load initial content
    loadMarkdown('docs/1-getting-started/1-quick-start-guide.md');
});
