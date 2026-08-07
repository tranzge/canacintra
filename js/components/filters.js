const Filters = {
    render(data, container) {
        if (!data || !data.length) return;

        const keys = Object.keys(data[0]);
        const catKey = keys.find(k => k.includes('Giro o Sector')) || keys.find(k => k.toLowerCase().includes('sector')) || keys[4];
        
        const uniqueCategories = [...new Set(data.map(row => row[catKey]).filter(Boolean))].sort();

        // Le añadimos fondo blanco fijo en modo claro, y fondo negro fijo en modo oscuro a toda la etiqueta <select>
        const html = `
            <div class="glass-panel p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
                <div class="relative w-full sm:w-72">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="ph ph-funnel text-gray-400"></i>
                    </div>
                    <select id="category-filter" class="glass-input w-full pl-10 h-11 appearance-none cursor-pointer bg-white dark:bg-dark-card text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                        <option value="">Todos los sectores</option>
                        ${uniqueCategories.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i class="ph ph-caret-down text-gray-400"></i>
                    </div>
                </div>
                <div class="flex-1"></div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-gray-500 mr-2"><span id="filter-count">${Helpers.formatNumber(data.length)}</span> proyectos</div>
                    <button id="clear-filters" class="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <i class="ph ph-x-circle"></i> Limpiar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML = html;

        const selectEl = document.getElementById('category-filter');
        const countSpan = document.getElementById('filter-count');
        
        const applyFilter = (val) => {
            let filtered = data;
            if (val) {
                filtered = data.filter(row => row[catKey] === val);
            }
            countSpan.textContent = Helpers.formatNumber(filtered.length);
            window.dispatchEvent(new CustomEvent('filterChanged', { detail: filtered }));
        };

        selectEl.addEventListener('change', (e) => applyFilter(e.target.value));
        
        document.getElementById('clear-filters').addEventListener('click', () => {
            selectEl.value = '';
            applyFilter('');
        });
    }
};
