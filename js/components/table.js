const Table = {
    currentPage: 1,
    pageSize: 10,
    currentData: [],
    
    render(data, container) {
        this.currentData = data;
        this.currentPage = 1;
        
        const html = `
            <div class="glass-panel overflow-hidden mt-6 animate-fade-in flex flex-col" style="animation-delay: 0.3s">
                <div class="p-5 border-b border-gray-200 dark:border-dark-border flex justify-between items-center bg-white/50 dark:bg-gray-800/50">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                        <i class="ph ph-table"></i> Detalle de Registros
                    </h3>
                    <div class="flex gap-2">
                        <select id="table-page-size" class="glass-input py-1.5 text-sm h-9">
                            <option value="10">10 / pág</option>
                            <option value="25">25 / pág</option>
                            <option value="50">50 / pág</option>
                        </select>
                    </div>
                </div>
                <div class="overflow-x-auto min-h-[300px]">
                    <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="text-xs uppercase bg-gray-50/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 sticky top-0 z-10">
                            <tr id="table-header"></tr>
                        </thead>
                        <tbody id="table-body" class="divide-y divide-gray-200 dark:divide-dark-border text-gray-700 dark:text-gray-300">
                        </tbody>
                    </table>
                </div>
                <div class="p-4 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/50 mt-auto" id="table-pagination">
                </div>
            </div>
        `;
        container.innerHTML = html;
        
        document.getElementById('table-page-size').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.updateTable();
        });

        this.updateTable();
    },

    updateTable() {
        if (!this.currentData || !this.currentData.length) {
            document.getElementById('table-body').innerHTML = `<tr><td class="p-12 text-center text-gray-500" colspan="100%">
                <i class="ph ph-folder-open text-4xl mb-2 text-gray-300 dark:text-gray-600"></i><br>
                No hay datos para mostrar con los filtros actuales
            </td></tr>`;
            document.getElementById('table-pagination').innerHTML = '';
            return;
        }

        const keys = Object.keys(this.currentData[0]).slice(0, 7); 
        
        const headerHtml = keys.map(k => `<th class="px-6 py-4 font-medium tracking-wider cursor-pointer hover:text-primary-600 transition-colors">${k}</th>`).join('');
        document.getElementById('table-header').innerHTML = headerHtml;

        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = this.currentData.slice(start, end);

        window._tableRowClick = (idx) => {
            window.dispatchEvent(new CustomEvent('rowClicked', { detail: pageData[idx] }));
        };

        const bodyHtml = pageData.map((row, idx) => {
            const cells = keys.map((k, colIdx) => {
                let val = row[k];
                if (val && typeof val === 'string' && val.length > 50) val = val.substring(0, 47) + '...';
                const content = val !== null && val !== undefined && val !== '' ? val : '<span class="text-gray-400">-</span>';
                
                // Make the first column semi-bold
                if (colIdx === 0) return `<td class="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">${content}</td>`;
                return `<td class="px-6 py-4">${content}</td>`;
            }).join('');
            
            return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer transition-colors group" onclick="window._tableRowClick(${idx})">${cells}</tr>`;
        }).join('');
        
        document.getElementById('table-body').innerHTML = bodyHtml;
        this.renderPagination();
    },

    renderPagination() {
        const totalPages = Math.ceil(this.currentData.length / this.pageSize);
        const container = document.getElementById('table-pagination');
        
        const startItem = ((this.currentPage - 1) * this.pageSize) + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, this.currentData.length);

        window._tableChangePage = (page) => {
            if(page >= 1 && page <= totalPages) {
                this.currentPage = page;
                this.updateTable();
            }
        };

        container.innerHTML = `
            <span class="text-sm text-gray-500">Mostrando <span class="font-medium text-gray-900 dark:text-white">${startItem}</span> a <span class="font-medium text-gray-900 dark:text-white">${endItem}</span> de <span class="font-medium text-gray-900 dark:text-white">${Helpers.formatNumber(this.currentData.length)}</span></span>
            <div class="flex items-center gap-1">
                <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30 transition-colors" ${this.currentPage === 1 ? 'disabled' : ''} onclick="window._tableChangePage(${this.currentPage - 1})"><i class="ph ph-caret-left"></i></button>
                <span class="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800/80 rounded-md font-medium">${this.currentPage} <span class="text-gray-400 font-normal mx-1">/</span> ${totalPages}</span>
                <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30 transition-colors" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window._tableChangePage(${this.currentPage + 1})"><i class="ph ph-caret-right"></i></button>
            </div>
        `;
    }
};
