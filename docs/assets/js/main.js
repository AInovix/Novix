document.addEventListener('DOMContentLoaded', function() {
    // Select all the sidebar links
    const sidebarLinks = document.querySelectorAll('.nav-section a');

    // Handle click event for loading markdown content dynamically
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default anchor behavior

            // Get the target markdown file
            const markdownPath = e.target.getAttribute('data-md');
            loadMarkdownContent(markdownPath);
        });
    });

    // Load the content dynamically by fetching the markdown file
    function loadMarkdownContent(path) {
        fetch(path)
            .then(response => response.text())
            .then(data => {
                // Dynamically convert markdown to HTML and inject it into the content area
                const contentArea = document.querySelector('#dynamic-content');
                contentArea.innerHTML = markdownToHtml(data);
            })
            .catch(error => {
                console.error('Error loading the markdown file:', error);
                document.querySelector('#dynamic-content').innerHTML = "<p>Sorry, we couldn't load the content. Please try again later.</p>";
            });
    }

    // Basic markdown to HTML converter
    function markdownToHtml(markdown) {
        let html = markdown;

        // Convert headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Convert lists
        html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

        // Convert paragraphs
        html = html.replace(/\n/gim, '<p>$1</p>');

        return html.trim();
    }
});
