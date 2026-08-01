const Charts = {
    instances: {},

    render(data, container) {
        if (!data || !data.length) return;
        
        const html = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 animate-fade-in" style="animation-delay: 0.2s">
                <div class="glass-panel p-6 lg:col-span-2">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Distribución por Categoría</h3>
                        <div class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <i class="ph ph-chart-bar text-gray-500"></i>
                        </div>
                    </div>
                    <div class="relative h-72 w-full">
                        <canvas id="barChart"></canvas>
                    </div>
                </div>
                <div class="glass-panel p-6 flex flex-col">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Proporción</h3>
                        <div class="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <i class="ph ph-chart-pie-slice text-gray-500"></i>
                        </div>
                    </div>
                    <div class="relative flex-1 w-full flex items-center justify-center min-h-[200px]">
                        <canvas id="donutChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.initCharts(data);

        if(!this._themeListener) {
            this._themeListener = (e) => this.updateTheme(e.detail.theme);
            window.addEventListener('themeChanged', this._themeListener);
        }
    },

    initCharts(data) {
        Object.values(this.instances).forEach(chart => chart.destroy());
        this.instances = {};

        const isDark = ThemeManager.isDark();
        const textColor = isDark ? '#9ca3af' : '#4b5563';
        const gridColor = isDark ? '#334155' : '#e5e7eb';
        
        const keys = Object.keys(data[0]);
        let catKey = keys.find(k => k.toLowerCase().includes('categor') || k.toLowerCase().includes('tipo')) || keys[1] || keys[0];
        let subKey = keys.find(k => k.toLowerCase().includes('sexo') || k.toLowerCase().includes('status')) || keys[2] || keys[1] || keys[0];

        const barCounts = {};
        data.forEach(row => {
            const val = row[catKey];
            if(val) barCounts[val] = (barCounts[val] || 0) + 1;
        });
        
        // Sort and slice top 10
        const sortedBar = Object.entries(barCounts).sort((a,b) => b[1]-a[1]).slice(0, 10);
        const barLabels = sortedBar.map(i => i[0].length > 15 ? i[0].substring(0,15)+'...' : i[0]);
        const barData = sortedBar.map(i => i[1]);
        const colors = Helpers.generateChartColors(barLabels.length, isDark);

        const ctxBar = document.getElementById('barChart');
        if(ctxBar) {
            this.instances.bar = new Chart(ctxBar.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: barLabels,
                    datasets: [{
                        label: 'Registros',
                        data: barData,
                        backgroundColor: colors,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { cornerRadius: 8, padding: 12 } },
                    scales: {
                        x: { ticks: { color: textColor, font: { family: 'Inter' } }, grid: { display: false } },
                        y: { ticks: { color: textColor, font: { family: 'Inter' } }, grid: { color: gridColor, borderDash: [4, 4] }, border: { display: false } }
                    }
                }
            });
        }

        const donutCounts = {};
        data.forEach(row => {
            const val = row[subKey];
            if(val) donutCounts[val] = (donutCounts[val] || 0) + 1;
        });
        const sortedDonut = Object.entries(donutCounts).sort((a,b) => b[1]-a[1]).slice(0, 5);
        const donutLabels = sortedDonut.map(i => i[0]);
        const donutData = sortedDonut.map(i => i[1]);

        const ctxDonut = document.getElementById('donutChart');
        if(ctxDonut) {
            this.instances.donut = new Chart(ctxDonut.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: donutLabels,
                    datasets: [{
                        data: donutData,
                        backgroundColor: Helpers.generateChartColors(donutLabels.length, isDark).reverse(),
                        borderWidth: 2,
                        borderColor: isDark ? '#1e293b' : '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor, padding: 15, usePointStyle: true, font: { family: 'Inter' } }
                        },
                        tooltip: { cornerRadius: 8, padding: 12 }
                    }
                }
            });
        }
    },

    updateTheme(theme) {
        const isDark = theme === 'dark';
        const textColor = isDark ? '#9ca3af' : '#4b5563';
        const gridColor = isDark ? '#334155' : '#e5e7eb';
        
        if (this.instances.bar) {
            this.instances.bar.options.scales.x.ticks.color = textColor;
            this.instances.bar.options.scales.y.ticks.color = textColor;
            this.instances.bar.options.scales.y.grid.color = gridColor;
            this.instances.bar.update();
        }
        if (this.instances.donut) {
            this.instances.donut.options.plugins.legend.labels.color = textColor;
            this.instances.donut.data.datasets[0].borderColor = isDark ? '#1e293b' : '#ffffff';
            this.instances.donut.update();
        }
    }
};
