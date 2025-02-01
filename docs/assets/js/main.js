document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");

    // Function to load markdown content
    const loadMarkdown = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
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

    // Click handlers
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filePath = link.dataset.md.replace(/ /g, '%20'); // Replace spaces with %20
            history.pushState({}, '', window.location.pathname);
            loadMarkdown(filePath);
        });
    });

    // Load initial content
    const initialFile = 'docs/1.%20getting%20started/1.%20quick%20start%20guide.md';
    loadMarkdown(initialFile);
});
