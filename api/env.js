export default function handler(req, res) {
  // Set headers to prevent CORS issues
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`GEMINI_API_KEY=${apiKey}\nGEMINI_MODEL=${model}`);
}
