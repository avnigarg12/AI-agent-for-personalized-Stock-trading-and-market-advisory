import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function runTest() {
    try {
        console.log("Testing chart fetch for MSFT, 1M with period1");
        
        let period1 = new Date();
        period1.setMonth(period1.getMonth() - 1);
        
        const chartResult1M = await yahooFinance.chart('MSFT', { 
            period1: period1.toISOString().split('T')[0], 
            interval: '1d' 
        });
        console.log("1M Chart Success! Points:", chartResult1M?.quotes?.length);

        console.log("\nTesting chart fetch for MSFT, 1D with period1");
        let period1d = new Date();
        period1d.setDate(period1d.getDate() - 2); // 2 days ago to ensure market was open
        const chartResult1D = await yahooFinance.chart('MSFT', { 
            period1: period1d.toISOString().split('T')[0], 
            interval: '15m' 
        });
        console.log("1D Chart Success! Points:", chartResult1D?.quotes?.length);

    } catch (e) {
        console.error("Chart Error:", e.name, e.message);
        if (e.errors) console.error("Validation details:", e.errors);
    }
}

runTest();
