const Dashboard = {
    render(data, container) {
        if (!data || !data.length) return;
        
        const total = data.length;
        
        const keys = Object.keys(data[0]);
        let catKey = keys.find(k => k.toLowerCase().includes('estado') || k.toLowerCase().includes('status') || k.toLowerCase().includes('categor'));
        if (!catKey) catKey = keys[1]; 

        const counts = {};
        data.forEach(row => {
            const val = row[catKey];
            if (val) {
                counts[val] = (counts[val] || 0) + 1;
            }
        });
        
        let topCat = '-';
        let topCount = 0;
        for (const [k, v] of Object.entries(counts)) {
            if (v > topCount) {
                topCount = v;
                topCat = k;
            }
        }

        const html = `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in" style="animation-delay: 0.1s">
                <div class="glass-panel p-5 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Registros</p>
                            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">${Helpers.formatNumber(total)}</h3>
                        </div>
                        <div class="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                            <i class="ph ph-users text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="glass-panel p-5 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Principal ${catKey}</p>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-1 truncate max-w-[150px]" title="${topCat}">${topCat}</h3>
                            <p class="text-xs text-gray-500 mt-1">${Helpers.formatNumber(topCount)} registros</p>
                        </div>
                        <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <i class="ph ph-trend-up text-xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="glass-panel p-5 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio Diario</p>
                            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">~${Helpers.formatNumber(Math.round(total / 30))}</h3>
                        </div>
                        <div class="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <i class="ph ph-calendar text-xl"></i>
                        </div>
                    </div>
                </div>

                <div class="glass-panel p-5 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completitud</p>
                            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mt-1">98%</h3>
                        </div>
                        <div class="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                            <i class="ph ph-check-circle text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
};
