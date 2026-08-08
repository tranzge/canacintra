const Gallery = {
    render(data, container) {
        if (!data || !data.length) {
            container.innerHTML = `
                <div class="p-12 text-center text-gray-500 glass-panel !rounded-3xl border-dashed">
                    <i class="ph ph-folder-open text-5xl mb-3 text-gray-300 dark:text-gray-600"></i><br>
                    <span class="font-medium text-lg">No se encontraron emprendimientos</span>
                </div>`;
            return;
        }

        const keys = Object.keys(data[0]);
        const nameKey = keys.find(k => k.includes('Nombre de la empresa')) || keys.find(k => k.toLowerCase().includes('empresa')) || keys[3];
        const descKey = keys.find(k => k.includes('Descripción corta')) || keys.find(k => k.toLowerCase().includes('descrip')) || keys[5];
        const catKey = keys.find(k => k.includes('Giro o Sector')) || keys.find(k => k.toLowerCase().includes('sector')) || keys[4];
        const logoKey = keys.find(k => k.includes('Logotipo')) || keys.find(k => k.toLowerCase().includes('logo'));
        const linkKey = keys.find(k => k.includes('Enlace')) || keys.find(k => k.toLowerCase().includes('redes'));

        const html = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in" style="animation-delay: 0.1s">
                ${data.map((row, idx) => {
                    const name = row[nameKey] || 'Emprendimiento Sin Nombre';
                    let desc = row[descKey] || 'Haz clic para ver los detalles completos de este proyecto.';
                    if (desc.length > 120) desc = desc.substring(0, 117) + '...';
                    const cat = catKey ? row[catKey] : '';
                    let logoUrl = logoKey ? row[logoKey] : null;
                    const link = linkKey ? row[linkKey] : null;
                    
                    let hasLogo = false;
                    if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('http')) {
                        hasLogo = true;
                        if (logoUrl.includes('drive.google.com/open?id=')) {
                            logoUrl = logoUrl.replace('open?id=', 'uc?export=view&id=');
                        }
                    }
                    
                    return `
                    <div class="glass-panel overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-secondary-900/10 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-100 dark:border-gray-800 !rounded-3xl" onclick="window.dispatchEvent(new CustomEvent('rowClicked', { detail: window._galleryData[${idx}] }))">
                        <!-- Imagen/Logo -->
                        <div class="h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden border-b border-gray-100 dark:border-gray-800/50">
                            ${hasLogo ? 
                                `<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: url('${logoUrl}')"></div>` 
                                : `<div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center rotate-3 group-hover:-rotate-3 transition-transform duration-300"><i class="ph ph-storefront text-4xl text-gray-300 dark:text-gray-600"></i></div>`
                            }
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-secondary-900/10 transition-colors duration-300"></div>
                        </div>
                        
                        <div class="p-6 flex-1 flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                            <!-- ETIQUETA EN AZUL MARINO -->
                            ${cat ? `<span class="inline-block px-3 py-1.5 text-[10px] font-black tracking-widest uppercase bg-secondary-100 dark:bg-secondary-900/40 text-secondary-800 dark:text-secondary-300 rounded-full mb-4 self-start">${cat}</span>` : ''}
                            
                            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-secondary-800 dark:group-hover:text-secondary-400 transition-colors">${name}</h3>
                            
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 font-medium leading-relaxed">${desc}</p>
                            
                            <div class="pt-4 flex justify-between items-center mt-auto">
                                <span class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-secondary-800 dark:group-hover:text-secondary-400 transition-colors">Conocer más</span>
                                <!-- BOTON FLECHA EN AZUL MARINO -->
                                <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-secondary-900 group-hover:text-white transition-all shadow-sm group-hover:shadow-md group-hover:shadow-secondary-900/30">
                                    <i class="ph ph-arrow-right text-lg text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"></i>
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
