  const fs = require('fs');
const path = require('path');

try {
  const serverJsPath = path.join(__dirname, 'server.js');
  const altJsPath = path.join(__dirname, 'alternative.js');

  const serverJs = fs.readFileSync(serverJsPath, 'utf8');
  let altJs = fs.readFileSync(altJsPath, 'utf8');

  const dbStart = serverJs.indexOf('const foodDatabase = [');
  const matchEnd = serverJs.indexOf('app.post(\'/api/alternative\'');

  if (dbStart === -1 || matchEnd === -1) {
    throw new Error('Could not find boundaries in server.js');
  }

  let extractedCode = serverJs.substring(dbStart, matchEnd).trim();

  // Replace API config with extracted code
  const apiConfigRegex = /\/\/ ============================\r?\n\/\/ API Configuration\r?\n\/\/ ============================\r?\nconst API_BASE = [^;]+;/m;
  altJs = altJs.replace(apiConfigRegex, extractedCode);

  // Replace fetchAlternative function
  const fetchFuncRegex = /async function fetchAlternative\(foodName\) \{[\s\S]*?return response\.json\(\);\r?\n\}/m;
  const newFetchFunc = `async function fetchAlternative(foodName) {
  return new Promise((resolve, reject) => {
    // Simulate slight network delay for UI effect
    setTimeout(() => {
      if (!foodName || !foodName.trim()) {
        return reject(new Error('Please provide a food name.'));
      }
      const match = findMatch(foodName);
      if (match) {
        resolve({
          packagedFood: { name: match.name, icon: match.icon },
          alternative: match.alternative,
          alternatives: match.alternatives || []
        });
      } else {
        reject(new Error(\`No alternative found for "\${foodName}". Try a different name or product.\`));
      }
    }, 600);
  });
}`;
  altJs = altJs.replace(fetchFuncRegex, newFetchFunc);

  // Replace health check fetch
  const healthCheckRegex = /fetch\(\`\$\{API_BASE\}\/api\/health\`\)[\s\S]*?\}\);\r?\n    \}\)\;/m;
  const healthCheckRegex2 = /fetch\(\`\$\{API_BASE\}\/api\/health\`\)[\s\S]*?\}\);\r?\n\s*\}\)\;/m;
  const healthCheckRegex3 = /fetch\(\`\$\{API_BASE\}\/api\/health\`\)[\s\S]*?\}\);/m;
  
  altJs = altJs.replace(healthCheckRegex3, `console.log(\`✅ Local database loaded: \${foodDatabase.length} foods available\`);`);

  fs.writeFileSync(altJsPath, altJs);
  console.log('Migration successful!');
} catch (err) {
  console.error('Migration failed:', err);
}
