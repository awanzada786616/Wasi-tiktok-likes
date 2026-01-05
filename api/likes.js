export default async function handler(req, res) {
    // 1. CORS Headers (Browser Access)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. API Config
    const API_URL = 'https://shadowsmmpanel.com/api/v2';
    const API_KEY = 'c29a88e5308eee982b2a9d147edf7d3f'; // Apni Key Lagayen
    const SERVICE_ID = '4501';

    try {
        // 3. Get Data from Frontend
        // Agar POST request hai to body se, nahi to query se
        const { link, quantity, action } = req.method === 'POST' ? JSON.parse(req.body) : req.query;

        let postData = {};

        if (action === 'balance') {
            postData = { key: API_KEY, action: 'balance' };
        } else {
            if (!link || !quantity) return res.status(400).json({ error: "Link and Quantity required" });
            postData = { 
                key: API_KEY, 
                action: 'add', 
                service: SERVICE_ID, 
                link: link, 
                quantity: quantity 
            };
        }

        // 4. Call SMM Panel API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(postData)
        });

        const data = await response.json();

        // 5. Send Response back to Website
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
}
