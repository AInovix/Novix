document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent page navigation

            const filePath = link.getAttribute("data-md");

            fetch(filePath)
                .then(response => response.text())
                .then(data => {
                    contentArea.innerHTML = marked(data); // Use Marked.js to convert markdown to HTML
                })
                .catch(error => {
                    contentArea.innerHTML = "<p>Error loading content. Please check the link.</p>";
                    console.error("Error loading file:", error);
                });
        });
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        document.body.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
    });
});
