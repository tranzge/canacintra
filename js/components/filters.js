const Filters = {
    render(data, container) {
        const html = `
            <div class="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4 items-center animate-fade-in">
                <div class="relative w-full md:w-96 group">
                    <i class="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
                    <input type="text" id="global-search" placeholder="Buscar en todos los campos..." class="glass-input w-full pl-10 h-11 transition-shadow focus:shadow-md">
                </div>
                <div class="flex-1"></div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-gray-500 mr-2"><span id="filter-count">${Helpers.formatNumber(data.length)}</span> resultados</div>
                    <button id="clear-filters" class="text-sm px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <i class="ph ph-x-circle"></i> Limpiar
                    </button>
                </div>
            </div>
        `;
        container.innerHTML = html;

        const searchInput = document.getElementById('global-search');
        const countSpan = document.getElementById('filter-count');
        
        const onSearch = Helpers.debounce((val) => {
            let filtered = data;
            if(val) {
                val = val.toLowerCase();
                filtered = data.filter(row => {
                    return Object.values(row).some(v => v && String(v).toLowerCase().includes(val));
                });
            }
            countSpan.textContent = Helpers.formatNumber(filtered.length);
            window.dispatchEvent(new CustomEvent('filterChanged', { detail: filtered }));
        }, 300);

        searchInput.addEventListener('input', (e) => onSearch(e.target.value));
        
        document.getElementById('clear-filters').addEventListener('click', () => {
            searchInput.value = '';
            countSpan.textContent = Helpers.formatNumber(data.length);
            window.dispatchEvent(new CustomEvent('filterChanged', { detail: data }));
        });
    }
};
