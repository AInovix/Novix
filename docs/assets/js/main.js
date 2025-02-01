document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.sidebar-link');
    const contentArea = document.getElementById('dynamic-content');
    const themeToggleButton = document.getElementById('theme-toggle');

    // Function to fetch and display markdown content
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const filePath = this.getAttribute('data-md'); // Get the file path from the data-md attribute
            
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error loading content.');
                    }
                    return response.text();
                })
                .then(mdContent => {
                    // Convert markdown to HTML using marked.js
                    contentArea.innerHTML = marked(mdContent);
                })
                .catch(error => {
                    contentArea.innerHTML = `<p>Error loading content. Please check the link.</p>`;
                });
        });
    });

    // Toggle light/dark mode
    themeToggleButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        // Toggle the text on the button
        themeToggleButton.textContent = document.body.classList.contains('dark-theme') ? '🌞' : '🌙';
    });
});
