document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    initializeApp();

    const refreshBtn = document.getElementById('refresh-btn');
    if(refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('animate-spin');
            await initializeApp(true);
            icon.classList.remove('animate-spin');
        });
    }
});

async function initializeApp(forceRefresh = false) {
    const container = document.getElementById('dashboard-container');
    
    try {
        const data = await API.fetchSheetData(forceRefresh);
        
        // Remove skeleton layout
        container.innerHTML = '';
        
        // Initialize Details Panel first so it can listen to events
        DetailsPanel.init();

        // Create structure
        container.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 animate-fade-in">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Resumen General</h2>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Última actualización: ${Helpers.formatDate(new Date())}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.print()" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-primary-500/30">
                        <i class="ph ph-printer"></i> Imprimir Reporte
                    </button>
                </div>
            </div>
            
            <div id="filters-container"></div>
            <div id="kpi-container"></div>
            <div id="charts-container"></div>
            <div id="table-container"></div>
        `;

        const filtersEl = document.getElementById('filters-container');
        const kpiEl = document.getElementById('kpi-container');
        const chartsEl = document.getElementById('charts-container');
        const tableEl = document.getElementById('table-container');

        // Initial Render
        Filters.render(data, filtersEl);
        Dashboard.render(data, kpiEl);
        Charts.render(data, chartsEl);
        Table.render(data, tableEl);

        // Listen for filter changes to update sub-components
        window.addEventListener('filterChanged', (e) => {
            const filteredData = e.detail;
            Dashboard.render(filteredData, kpiEl);
            Charts.render(filteredData, chartsEl);
            Table.render(filteredData, tableEl);
        });

        window.addEventListener('dataUpdated', (e) => {
            console.log("Data updated via background sync", e.detail);
            // Optionally auto-refresh if no filters applied
        });

    } catch (error) {
        container.innerHTML = `
            <div class="glass-panel p-8 flex flex-col items-center justify-center text-center h-80 border-red-500/30">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <i class="ph ph-warning-circle text-3xl text-red-500"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Error al cargar datos</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-md">No se pudo conectar con Google Sheets. Verifica que el enlace sea correcto y esté publicado en la web como CSV.</p>
                <button onclick="window.location.reload()" class="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">
                    Reintentar
                </button>
            </div>
        `;
    }
}
