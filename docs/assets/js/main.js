// Light/Dark Mode Toggle Functionality
const themeSwitcher = document.getElementById('theme-switcher');

// Check for existing theme preference on load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitcher.checked = true;  // Ensure checkbox reflects stored theme
} else {
    document.body.classList.remove('dark-mode');
    themeSwitcher.checked = false;  // Ensure checkbox reflects stored theme
}

// Listen for changes to the toggle and apply the selected theme
themeSwitcher.addEventListener('change', () => {
    if (themeSwitcher.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});
// Fetch markdown content and render as HTML
document.querySelectorAll('a[data-md]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const mdFile = this.getAttribute('data-md');
        
        // Fetch the markdown file
        fetch(mdFile)
            .then(response => response.text())
            .then(markdownContent => {
                const contentArea = document.getElementById('dynamic-content');
                // Use a simple markdown-to-HTML converter like marked.js
                const htmlContent = marked(markdownContent);
                contentArea.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error('Error loading markdown:', error);
            });
    });
});
