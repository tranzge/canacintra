const DetailsPanel = {
    init() {
        this.panel = document.getElementById('details-panel');
        this.overlay = document.getElementById('details-overlay');
        
        window.addEventListener('rowClicked', (e) => this.open(e.detail));
        this.overlay.addEventListener('click', () => this.close());
    },

    // Esta función limpia el título (ej. le quita el "(MÁXIMO 150 CARACTERES)" y pone mayúscula inicial)
    cleanKeyName(key) {
        let clean = key.replace(/\(.*?\)/g, '').trim();
        if (clean.length > 0) {
            clean = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
        }
        return clean;
    },

    open(data) {
        const html = `
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shrink-0">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                        <i class="ph ph-file-text text-xl"></i>
                    </div>
                    <h2 class="text-xl font-bold">Detalles del Emprendimiento</h2>
                </div>
                <button onclick="DetailsPanel.close()" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <i class="ph ph-x text-lg"></i>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                ${Object.entries(data).map(([key, val]) => {
                    // Ignoramos completamente la columna de Marca temporal
                    if(key.toLowerCase().includes('marca temporal')) return '';
                    
                    const displayKey = this.cleanKeyName(key);
                    const isUrl = typeof val === 'string' && val.startsWith('http');
                    const displayVal = isUrl ? `<a href="${val}" target="_blank" class="text-primary-600 hover:underline flex items-center gap-1"><i class="ph ph-link"></i> Abrir enlace</a>` : 
                                       (val !== null && val !== undefined && val !== '' ? val : '<span class="text-gray-400 italic font-normal">No especificado</span>');
                    
                    return `
                        <div class="bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 transition-colors hover:border-gray-200 dark:hover:border-gray-700">
                            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                                ${displayKey}
                            </p>
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">${displayVal}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        this.panel.innerHTML = html;
        this.currentData = data;
        
        // Mostrar el panel
        this.overlay.classList.remove('hidden');
        void this.overlay.offsetWidth; // Reflow
        this.overlay.classList.remove('opacity-0');
        this.panel.classList.remove('translate-x-full');
    },

    close() {
        this.panel.classList.add('translate-x-full');
        this.overlay.classList.add('opacity-0');
        setTimeout(() => {
            this.overlay.classList.add('hidden');
        }, 300);
    }
};
