document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");
    const themeToggle = document.getElementById("theme-toggle");

    // Load content dynamically
    sidebarLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const mdPath = link.getAttribute("data-md");
            try {
                const response = await fetch(mdPath);
                if (!response.ok) throw new Error(`Failed to fetch ${mdPath}`);
                const markdown = await response.text();
                contentArea.innerHTML = marked.parse(markdown);
                Prism.highlightAll(); // Re-highlight code blocks
                mermaid.run(); // Re-render Mermaid diagrams
                document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            } catch (error) {
                contentArea.innerHTML = `<h2>Error</h2><p>Could not load ${mdPath}. Please check the file path or try again later.</p>`;
                console.error(error);
            }
        });
    });

    // Theme toggle with local storage
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.toggle("light-theme", savedTheme === "light");
    themeToggle.innerHTML = savedTheme === "light" ? "🌙" : "🌓";

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const newTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        themeToggle.innerHTML = newTheme === "light" ? "🌙" : "🌓";
        const prismTheme = newTheme === "light" ?
            "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css" :
            "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-dark.min.css";
        document.getElementById("prism-theme").setAttribute("href", prismTheme);
    });

    // Load default content (README.md)
    sidebarLinks[0].click();
});
