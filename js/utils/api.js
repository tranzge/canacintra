const API = {
    async fetchSheetData(forceRefresh = false) {
        try {
            if (!forceRefresh) {
                const cached = this.getCache();
                if (cached) {
                    this.fetchAndParse().then(newData => {
                        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: newData }));
                    }).catch(err => console.error("Background fetch failed", err));
                    return cached;
                }
            }

            const data = await this.fetchAndParse();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    },

    fetchAndParse() {
        return new Promise((resolve, reject) => {
            Papa.parse(CONFIG.CSV_URL, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length && CONFIG.DEBUG) {
                        console.warn("PapaParse Errors:", results.errors);
                    }
                    // Filter empty rows
                    const validData = results.data.filter(row => Object.keys(row).length > 0 && Object.values(row).some(v => v !== null && v !== ''));
                    this.setCache(validData);
                    resolve(validData);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    },

    setCache(data) {
        try {
            const cacheObj = {
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cacheObj));
        } catch (e) {
            console.warn("Local storage full or disabled", e);
        }
    },

    getCache() {
        try {
            const cached = localStorage.getItem(CONFIG.CACHE_KEY);
            if (!cached) return null;
            
            const parsed = JSON.parse(cached);
            const isExpired = (Date.now() - parsed.timestamp) > CONFIG.UPDATE_INTERVAL_MS;
            
            if (isExpired) return null;
            return parsed.data;
        } catch (e) {
            return null;
        }
    }
};
