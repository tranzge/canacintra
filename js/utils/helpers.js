const Helpers = {
    formatNumber(num) {
        return new Intl.NumberFormat('es-MX').format(num);
    },
    
    formatCurrency(num) {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num);
    },
    
    formatDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        if(isNaN(d.getTime())) return dateString; // fallback
        return new Intl.DateTimeFormat('es-MX', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        }).format(d);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateChartColors(count, isDark) {
        const hues = [217, 199, 280, 340, 150, 45, 10, 250];
        return Array.from({ length: count }).map((_, i) => {
            const hue = hues[i % hues.length];
            const lightness = isDark ? '60%' : '50%';
            return `hsl(${hue}, 80%, ${lightness})`;
        });
    }
};
