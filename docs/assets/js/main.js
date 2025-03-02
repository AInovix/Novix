document.addEventListener("DOMContentLoaded", () => {
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const contentArea = document.getElementById("dynamic-content");
    const themeToggle = document.getElementById("theme-toggle");

    // Load content dynamically from Markdown files
    sidebarLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const mdPath = link.getAttribute("data-md");
            try {
                const response = await fetch(mdPath);
                if (!response.ok) throw new Error(`Failed to fetch ${mdPath}: ${response.status}`);
                const markdown = await response.text();
                
                if (typeof marked !== 'undefined') {
                    contentArea.innerHTML = marked.parse(markdown);
                } else {
                    throw new Error("Marked library not loaded");
                }
                
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                } else {
                    console.error("Prism not loaded");
                }
                
                if (typeof mermaid !== 'undefined') {
                    mermaid.run();
                } else {
                    console.error("Mermaid not loaded");
                }
                
                // Update active link
                sidebarLinks.forEach(l => l.classList.remove("active"));
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
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
    themeToggle.innerHTML = savedTheme === "light" ? "🌙" : "🌓";

    themeToggle.addEventListener("click", () => {
        console.log("Theme toggle clicked");
        document.body.classList.toggle("light-theme");
        document.body.classList.toggle("dark-theme");
        const newTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        themeToggle.innerHTML = newTheme === "light" ? "🌙" : "🌓";
        
        // Update Prism theme dynamically
        const prismTheme = newTheme === "light" ?
            "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css" :
            "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-dark.min.css";
        document.getElementById("prism-theme").setAttribute("href", prismTheme);
    });

    // Load default content (first link)
    if (sidebarLinks.length > 0) {
        sidebarLinks[0].click();
    }
});
