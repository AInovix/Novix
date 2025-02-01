// Light/Dark Mode Toggle Functionality
const themeSwitcher = document.getElementById('theme-switcher');

// Check for existing theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitcher.checked = true;
}

// Toggle the theme and store the preference
themeSwitcher.addEventListener('change', () => {
    if (themeSwitcher.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});
