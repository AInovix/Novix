<script>
    document.addEventListener("DOMContentLoaded", function () {
        // Get all links that have the 'data-md' attribute for dynamic content
        const links = document.querySelectorAll('a[data-md]');

        // Function to load the content from a markdown file and render it
        async function loadContent(filePath) {
            try {
                const response = await fetch(filePath);
                
                // If the file doesn't exist or there is an error
                if (!response.ok) {
                    throw new Error('Content not found');
                }

                const markdown = await response.text();
                const contentArea = document.getElementById('content-area');
                
                // Here we can use a library like marked.js to convert markdown to HTML
                // For simplicity, let's just wrap it in a <div>
                contentArea.innerHTML = `<div class="markdown-content">${markdown}</div>`;

                // Optionally, smooth scroll to the content area
                contentArea.scrollIntoView({ behavior: "smooth" });
            } catch (error) {
                // Show an error message if the content failed to load
                document.getElementById('content-area').innerHTML = `<p>Error loading content: ${error.message}</p>`;
            }
        }

        // Add event listeners for all links with 'data-md' attribute
        links.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default link behavior
                
                // Get the path of the markdown file from the 'data-md' attribute
                const mdFile = link.getAttribute("data-md");
                
                // Load the content from the markdown file
                loadContent(mdFile);
                
                // Highlight the active link in the navigation
                setActiveLink(link);
            });
        });

        // Smooth scroll for anchor links within the page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute("href")).scrollIntoView({
                    behavior: "smooth"
                });
            });
        });

        // Set the active link based on the current selection
        function setActiveLink(activeLink) {
            // Remove 'active' class from all links
            links.forEach(link => link.classList.remove("active"));
            
            // Add 'active' class to the clicked link
            activeLink.classList.add("active");
        }
    });
</script>
