
import axios from 'axios';

async function testBackend() {
    try {
        console.log("Checking backend for INFY.NS...");
        const res = await axios.get('http://localhost:5000/api/market/quote/INFY.NS');
        console.log("Full JSON Response:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Error connecting to backend:", e.message);
    }
}
testBackend();
