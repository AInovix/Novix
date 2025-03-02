class ThemeManager {
 constructor() {
 this.themeToggle = document.getElementById('theme-toggle');
 this.initTheme();
 this.bindEvents();
 }

 initTheme() {
 const savedTheme = localStorage.getItem('theme');
 const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
 document.documentElement.setAttribute('data-theme', initialTheme);
 console.log('ThemeManager initialized with:', initialTheme);
 }

 bindEvents() {
 this.themeToggle.addEventListener('click', () => {
 const currentTheme = document.documentElement.getAttribute('data-theme');
 const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
 
 document.documentElement.setAttribute('data-theme', newTheme);
 localStorage.setItem('theme', newTheme);
 
 this.updateMermaidTheme(newTheme);
 this.updatePrismTheme(newTheme);
 console.log('Theme switched to:', newTheme);
 });
 }

 updateMermaidTheme(theme) {
 if (typeof mermaid !== 'undefined') {
 mermaid.initialize({
 theme: theme === 'dark' ? 'dark' : 'default',
 securityLevel: 'loose'
 });
 mermaid.run();
 console.log('Mermaid theme updated to:', theme);
 }
 }

 updatePrismTheme(theme) {
 const prismLink = document.querySelector('link[href*="prism-"]');
 if (prismLink) {
 const newTheme = theme === 'dark' ? 'prism-okaidia' : 'prism';
 prismLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${newTheme}.min.css`;
 console.log('Prism theme updated to:', newTheme);
 }
 }
}

class DocumentationApp {
 constructor() {
 this.themeManager = new ThemeManager();
 this.cache = new Map();
 this.init();
 }

 init() {
 this.registerServiceWorker();
 this.setupEventListeners();
 this.handleInitialLoad();
 this.setupKeyboardNavigation();
 this.showThemeDebug();
 }

 registerServiceWorker() {
 if ('serviceWorker' in navigator) {
 navigator.serviceWorker.register('/sw.js')
 .then(() => console.log('Service Worker registered'))
 .catch(err => console.error('SW registration failed:', err));
 }
 }

 setupEventListeners() {
 // Mobile menu
 document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
 document.querySelector('.sidebar').classList.toggle('active');
 console.log('Mobile menu toggled');
 });

 // Search
 document.getElementById('search-input').addEventListener('input', (e) => {
 this.handleSearch(e.target.value);
 });

 // Navigation
 document.addEventListener('click', (e) => {
 const navLink = e.target.closest('.nav-link');
 if (navLink && !navLink.href) this.handleNavigation(navLink);
 });

 // History
 window.addEventListener('popstate', (e) => {
 this.loadContent(window.location.pathname, false);
 });

 // Loader handler
 window.addEventListener('load', () => {
 console.log('Window loaded, hiding initial loader');
 const loader = document.getElementById('loader');
 setTimeout(() => {
 loader.style.opacity = '0';
 document.getElementById('app').classList.add('loaded');
 setTimeout(() => {
 loader.remove();
 console.log('Initial loader removed');
 }, 300);
 }, 500);
 });
 }

 async handleNavigation(link) {
 const path = link.dataset.md;
 this.showLoader();
 
 history.pushState({ path }, '', `/docs/${path}`);
 
 await this.loadContent(path);
 this.updateActiveState(link);
 this.hideLoader();
 }

 async loadContent(path, checkCache = true) {
 try {
 if (checkCache && this.cache.has(path)) {
 return this.renderContent(this.cache.get(path));
 }

 const response = await fetch(path);
 if (!response.ok) throw new Error(`HTTP ${response.status}`);
 
 const content = await response.text();
 this.cache.set(path, content);
 this.renderContent(content);
 console.log('Content loaded from:', path);
 
 } catch (error) {
 this.showError(error);
 }
 }

 renderContent(markdown) {
 const html = marked.parse(markdown);
 const container = document.getElementById('dynamic-content');
 
 // Safe HTML parsing
 container.innerHTML = DOMPurify.sanitize(html);
 
 // Post-render tasks
 Prism.highlightAll();
 this.themeManager.updateMermaidTheme(document.documentElement.getAttribute('data-theme'));
 }

 handleSearch(query) {
 const results = this.searchIndex(query);
 const resultsContainer = document.getElementById('search-results');
 
 resultsContainer.innerHTML = results.map(result => `
 <div class="search-result-item" data-md="${result.path}">
 <h4>${result.title}</h4>
 <p>${result.excerpt}</p>
 </div>
 `).join('');
 
 resultsContainer.style.display = results.length ? 'block' : 'none';
 }

 searchIndex(query) {
 return Array.from(this.cache.entries()).map(([path, content]) => {
 const titleMatch = content.match(/#{1,2}\s+(.+)/);
 return {
 path,
 title: titleMatch ? titleMatch[1] : 'Untitled',
 excerpt: content.substring(0, 150),
 score: this.calculateSearchScore(content, query)
 };
 }).filter(item => item.score > 0)
 .sort((a, b) => b.score - a.score);
 }

 calculateSearchScore(content, query) {
 const cleanContent = content.toLowerCase();
 const cleanQuery = query.toLowerCase();
 let score = 0;

 if (cleanContent.includes(cleanQuery)) score += 50;
 if (cleanContent.startsWith(`# ${cleanQuery}`)) score += 100;
 
 return score;
 }

 setupKeyboardNavigation() {
 let focusedIndex = -1;
 const links = Array.from(document.querySelectorAll('.nav-link'));

 document.addEventListener('keydown', (e) => {
 if (e.key === 'ArrowDown') {
 focusedIndex = Math.min(focusedIndex + 1, links.length - 1);
 links[focusedIndex]?.focus();
 } else if (e.key === 'ArrowUp') {
 focusedIndex = Math.max(focusedIndex - 1, 0);
 links[focusedIndex]?.focus();
 } else if (e.key === 'Enter' && focusedIndex >= 0) {
 links[focusedIndex].click();
 }
 });
 }

 showLoader() {
 document.getElementById('content-loader').style.display = 'block';
 }

 hideLoader() {
 document.getElementById('content-loader').style.display = 'none';
 }

 showError(error) {
 const container = document.getElementById('dynamic-content');
 container.innerHTML = `
 <div class="error-message">
 <h3>⚠️ Loading Error</h3>
 <p>${error.message}</p>
 <button onclick="window.location.reload()">Reload Page</button>
 </div>
 `;
 }

 updateActiveState(activeLink) {
 document.querySelectorAll('.nav-link').forEach(link => {
 link.classList.toggle('active', link === activeLink);
 });
 }

 handleInitialLoad() {
 if (window.location.pathname !== '/') {
 this.loadContent(window.location.pathname.split('/docs/')[1]);
 }
 }

 showThemeDebug() {
 document.getElementById('debug-bg').textContent = getComputedStyle(document.documentElement)
 .getPropertyValue('--bg-color').trim();
 document.getElementById('debug-text').textContent = getComputedStyle(document.documentElement)
 .getPropertyValue('--text-color').trim();
 document.getElementById('debug-primary').textContent = getComputedStyle(document.documentElement)
 .getPropertyValue('--primary').trim();
 
 // Update every second
 setInterval(() => this.showThemeDebug(), 1000);
 }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
 window.docApp = new DocumentationApp();
 console.log('DocumentationApp initialized');
});
