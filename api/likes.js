export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const API_URL = "https://shadowsmmpanel.com/api/v2";
  const API_KEY = process.env.SMM_API_KEY;

  const SERVICES = {
    likes: { id: 4664, max: 770 },
    views: { id: 4688, max: 7700 },
    favourite: { id: 4004, max: 150 }
  };

  try {
    const { service, link, quantity } = req.body;

    if (!SERVICES[service]) {
      return res.status(400).json({ error: "Invalid service" });
    }

    if (quantity > SERVICES[service].max) {
      return res.status(400).json({
        error: `Max limit exceeded. Allowed: ${SERVICES[service].max}`
      });
    }

    const postData = {
      key: API_KEY,
      action: "add",
      service: SERVICES[service].id,
      link,
      quantity
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(postData)
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
