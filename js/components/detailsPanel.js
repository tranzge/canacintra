const DetailsPanel = {
    init() {
        this.panel = document.getElementById('details-panel');
        this.overlay = document.getElementById('details-overlay');
        
        window.addEventListener('rowClicked', (e) => this.open(e.detail));
        this.overlay.addEventListener('click', () => this.close());
    },

    open(data) {
        const html = `
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shrink-0">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                        <i class="ph ph-file-text text-xl"></i>
                    </div>
                    <h2 class="text-xl font-bold">Detalle de Registro</h2>
                </div>
                <button onclick="DetailsPanel.close()" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
                    <i class="ph ph-x text-lg"></i>
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                ${Object.entries(data).map(([key, val]) => {
                    const isUrl = typeof val === 'string' && val.startsWith('http');
                    const displayVal = isUrl ? `<a href="${val}" target="_blank" class="text-primary-500 hover:underline flex items-center gap-1"><i class="ph ph-link"></i> Abrir enlace</a>` : 
                                       (val !== null && val !== undefined && val !== '' ? val : '<span class="text-gray-400 italic font-normal">No especificado</span>');
                    return `
                        <div class="bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 transition-colors hover:border-gray-200 dark:hover:border-gray-700">
                            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                ${key}
                            </p>
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">${displayVal}</p>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card shrink-0 flex gap-3">
                <button onclick="DetailsPanel.copyToClipboard()" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2 shadow-sm shadow-primary-500/20">
                    <i class="ph ph-copy"></i> Copiar JSON
                </button>
                <button onclick="window.print()" class="flex-1 glass-panel py-2.5 rounded-lg transition-colors font-medium text-sm flex justify-center items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="ph ph-printer"></i> Imprimir
                </button>
            </div>
        `;
        
        this.panel.innerHTML = html;
        this.currentData = data;
        
        // Show panel
        this.overlay.classList.remove('hidden');
        // trigger reflow
        void this.overlay.offsetWidth;
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
