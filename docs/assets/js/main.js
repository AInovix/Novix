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
