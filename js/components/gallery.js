const Gallery = {
    render(data, container) {
        if (!data || !data.length) {
            container.innerHTML = `
                <div class="p-12 text-center text-gray-500 glass-panel">
                    <i class="ph ph-folder-open text-4xl mb-2 text-gray-300 dark:text-gray-600"></i><br>
                    No se encontraron emprendimientos con estos filtros.
                </div>`;
            return;
        }

        const keys = Object.keys(data[0]);
        // Mapeo dinámico aproximado de las columnas
        const nameKey = keys.find(k => k.toLowerCase().includes('nombre') || k.toLowerCase().includes('empresa') || k.toLowerCase().includes('emprendimiento')) || keys[1] || keys[0];
        const descKey = keys.find(k => k.toLowerCase().includes('descrip') || k.toLowerCase().includes('giro') || k.toLowerCase().includes('servicio') || k.toLowerCase().includes('resumen')) || keys[2] || keys[1];
        const catKey = keys.find(k => k.toLowerCase().includes('categor') || k.toLowerCase().includes('tipo') || k.toLowerCase().includes('sector')) || keys[3];

        const html = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in" style="animation-delay: 0.1s">
                ${data.map((row, idx) => {
                    const name = row[nameKey] || 'Emprendimiento Sin Nombre';
                    let desc = row[descKey] || 'Haz clic para ver los detalles completos de este proyecto.';
                    if (desc.length > 120) desc = desc.substring(0, 117) + '...';
                    const cat = catKey ? row[catKey] : '';
                    
                    return `
                    <div class="glass-panel overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full border border-gray-100 dark:border-gray-800" onclick="window.dispatchEvent(new CustomEvent('rowClicked', { detail: window._galleryData[${idx}] }))">
                        <!-- Placeholder Imagen/Logo -->
                        <div class="h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 flex items-center justify-center relative overflow-hidden border-b border-gray-100 dark:border-gray-800/50">
                            <i class="ph ph-rocket-launch text-5xl text-gray-300 dark:text-gray-700/50 group-hover:scale-110 group-hover:text-primary-500/20 transition-all duration-500"></i>
                            <div class="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/5 transition-colors duration-300"></div>
                        </div>
                        
                        <div class="p-5 flex-1 flex flex-col">
                            ${cat ? `<span class="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-3 self-start border border-primary-100 dark:border-primary-800/50">${cat}</span>` : ''}
                            
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">${name}</h3>
                            
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">${desc}</p>
                            
                            <div class="pt-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center mt-auto">
                                <span class="text-xs font-semibold text-primary-600 dark:text-primary-400">Descubrir más</span>
                                <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                                    <i class="ph ph-arrow-right text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        `;
        
        window._galleryData = data;
        container.innerHTML = html;
    }
};
