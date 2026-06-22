const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const text = fs.readFileSync(envPath, 'utf-8');

console.log('=== RAW .env content ===');
console.log(text);
console.log('=== Parsing ===');

const config = { API_KEY: '', MODEL: 'gemini-2.0-flash' };
text.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const sepIdx = trimmed.indexOf('=');
  if (sepIdx === -1) return;
  const key = trimmed.substring(0, sepIdx).trim();
  let value = trimmed.substring(sepIdx + 1).trim().replace(/^["']|["']$/g, '');
  console.log('  Key:', key, '=>', value.substring(0, 30) + '...');
  if (key === 'GEMINI_API_KEY' && value && value !== 'your_gemini_api_key_here' && !value.startsWith('sk-or')) {
    config.API_KEY = value;
  }
  if (key === 'GEMINI_MODEL' && value) config.MODEL = value;
});

console.log('');
console.log('Final config:');
console.log('  API_KEY set?', config.API_KEY ? 'YES ✅' : 'NO ❌');
console.log('  MODEL:', config.MODEL);