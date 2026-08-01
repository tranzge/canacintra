const ThemeManager = {
    init() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.htmlEl = document.documentElement;
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    },

    setTheme(theme) {
        if (theme === 'dark') {
            this.htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            this.htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    toggleTheme() {
        const isDark = this.htmlEl.classList.contains('dark');
        this.setTheme(isDark ? 'light' : 'dark');
    },

    isDark() {
        return this.htmlEl.classList.contains('dark');
    }
};
