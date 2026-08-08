document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    initializeApp();

    // Como quitamos el boton de actualizar, eliminamos su funcionalidad aquí
});

async function initializeApp(forceRefresh = false) {
    const container = document.getElementById('dashboard-container');
    
    try {
        let data = await API.fetchSheetData(forceRefresh);
        data = Helpers.shuffle(data); 
        
        container.innerHTML = '';
        DetailsPanel.init();

        container.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in">
                <div>
                    <!-- TITULO (SIN EFECTO DE GRADIANTE Y CON PADDING BOTTOM PARA LA LETRA O) -->
                    <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter pb-1">
                        <span class="text-primary-600">Directorio</span> Jóvenes CANACINTRA
                    </h2>
                    
                    <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg mt-4 max-w-2xl leading-relaxed font-medium">
                        Descubre los proyectos, ideas y negocios de nuestra comunidad. ¡Si quieres que tu emprendimiento o foto aparezca aquí, regístrate y únete al ecosistema!
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    
                <!-- BOTON AZUL MARINO -->
                    <a href="https://forms.gle/Tcsi4NmKwV8R82Qs9" target="_blank" class="bg-secondary-900 hover:bg-secondary-800 text-white px-8 py-3 rounded-lg text-base font-semibold flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5">
                        Registrar Emprendimiento
                    </a>
                </div>
            </div>
            
            <div id="filters-container"></div>
            <div id="gallery-container" class="mt-4"></div>
        `;

        const filtersEl = document.getElementById('filters-container');
        const galleryEl = document.getElementById('gallery-container');

        Filters.render(data, filtersEl);
        Gallery.render(data, galleryEl);

        window.addEventListener('filterChanged', (e) => {
            const filteredData = e.detail;
            Gallery.render(filteredData, galleryEl);
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
