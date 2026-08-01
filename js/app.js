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
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 animate-fade-in">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <i class="ph ph-rocket text-primary-600"></i>
                        Directorio de Emprendedores
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-2 max-w-2xl">
                        Descubre los proyectos locales. Si quieres que el tuyo aparezca aquí o necesitas agregar tu foto/logo, contáctanos o regístralo.
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                    <a href="#" target="_blank" class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
                        <i class="ph ph-plus-circle text-lg"></i>
                        Registra tu Emprendimiento
                    </a>
                </div>
            </div>
            
            <div id="filters-container"></div>
            <div id="gallery-container" class="mt-4"></div>
        `;

        const filtersEl = document.getElementById('filters-container');
        const galleryEl = document.getElementById('gallery-container');

        // Initial Render
        Filters.render(data, filtersEl);
        Gallery.render(data, galleryEl);

        // Listen for filter changes to update sub-components
        window.addEventListener('filterChanged', (e) => {
            const filteredData = e.detail;
            Gallery.render(filteredData, galleryEl);
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
