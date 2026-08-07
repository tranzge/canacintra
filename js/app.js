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
        let data = await API.fetchSheetData(forceRefresh);
        data = Helpers.shuffle(data); 
        
        container.innerHTML = '';
        DetailsPanel.init();

        container.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-fade-in">
                <div>
                    <!-- AQUI CAMBIAS EL TITULO PRINCIPAL -->
                    <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter">
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-green-400">Directorio</span> Jóvenes CANACINTRA
                    </h2>
                    
                    <!-- AQUI CAMBIAS LA DESCRIPCION DEBAJO DEL TITULO -->
                    <p class="text-gray-500 dark:text-gray-400 text-base md:text-lg mt-4 max-w-2xl leading-relaxed font-medium">
                        Descubre los proyectos, ideas y negocios de nuestra comunidad. ¡Si quieres que tu emprendimiento o foto aparezca aquí, regístrate y únete al ecosistema!
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    
                    <!-- AQUI CAMBIAS EL LINK DEL FORMS Y EL TEXTO DEL BOTON -->
                    <a href="https://forms.gle/Tcsi4NmKwV8R82Qs9" target="_blank" class="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-green-400 text-white px-8 py-3.5 rounded-full text-base font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1">
                        <i class="ph ph-lightning text-xl"></i>
                        ¡Registra tu Emprendimiento!
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
