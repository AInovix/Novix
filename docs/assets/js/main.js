document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");

    // Function to load content
    const loadContent = (filePath) => {
        // Encode URI components to handle spaces and special characters
        const encodedPath = encodeURI(filePath);
        
        fetch(encodedPath)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                contentArea.innerHTML = marked.parse(data);
                Prism.highlightAll(); // Optional: for code highlighting if needed
            })
            .catch(error => {
                contentArea.innerHTML = `
                    <div class="error-message">
                        <h3>⚠️ Content Load Error</h3>
                        <p>Failed to load: ${filePath}</p>
                        <p>${error.message}</p>
                    </div>
                `;
                console.error("Error loading file:", error);
            });
    };

    // Click handler for sidebar links
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            loadContent(link.getAttribute("data-md"));
        });
    });

    // Load initial content
    loadContent("docs/1. getting started/1. quick start guide.md");
});
