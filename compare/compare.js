// Gemini API Configuration
let GEMINI_API_KEY = '';
let GEMINI_MODEL = 'gemini-2.5-flash';
let GEMINI_API_URL = '';
let GEMINI_VISION_URL = '';
let isDemoMode = true;

function buildGeminiUrl(model) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function isValidApiKey(key) {
    return !!(key && key !== 'your_gemini_api_key_here' && key.trim() !== '');
}

function applyGeminiEndpoints() {
    GEMINI_API_URL = buildGeminiUrl(GEMINI_MODEL);
    GEMINI_VISION_URL = buildGeminiUrl(GEMINI_MODEL);
}

function parseEnvText(text) {
    text.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const separatorIdx = trimmed.indexOf('=');
        if (separatorIdx === -1) return;

        const key = trimmed.substring(0, separatorIdx).trim();
        const value = trimmed.substring(separatorIdx + 1).trim();
        const cleanVal = value.replace(/^["']|["']$/g, '');

        if (key === 'GEMINI_API_KEY' && isValidApiKey(cleanVal)) {
            GEMINI_API_KEY = cleanVal;
        }
        if (key === 'GEMINI_MODEL' && cleanVal) {
            GEMINI_MODEL = cleanVal;
        }
    });
}

async function fetchEnvFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) return false;
        parseEnvText(await response.text());
        return true;
    } catch (err) {
        console.warn(`Could not load config from ${path}:`, err.message);
        return false;
    }
}

// Store uploaded images and extracted data for each product
const uploadedImages = {
    p1: null,
    p2: null,
    p3: null
};

// Store extracted ingredients from AI analysis for each product
const extractedIngredients = {
    p1: '',
    p2: '',
    p3: ''
};

// Dataset of Preset Ingredients for Quick Fill
const PRESETS = {
    oreo: {
        name: "Oreo Cookies",
        ingredients: "Refined wheat flour, Sugar, Refined palm oil, Cocoa solids (3%), Invert sugar syrup, Leavening agents (500ii, 503ii), Iodised salt, Emulsifier (322), Artificial flavoring substance (Vanilla)"
    },
    bourbon: {
        name: "Bourbon Biscuits",
        ingredients: "Refined wheat flour (Maida), Sugar, Refined palm oil, Cocoa solids (3.2%), Invert sugar syrup, Leavening agents (503ii, 500ii), Iodised salt, Emulsifier (322, 471), Artificial flavoring substance (Chocolate)"
    },
    parleg: {
        name: "Parle-G Biscuit",
        ingredients: "Refined wheat flour (Maida), Sugar, Refined palm oil, Invert sugar syrup, Ammonium bicarbonate, Sodium bicarbonate, Iodised salt, Milk solids, Emulsifier (322, 471), Artificial flavoring substance (Vanilla)"
    },
    marie: {
        name: "Marie Gold Biscuit",
        ingredients: "Refined wheat flour (Maida), Sugar, Refined palm oil, Invert sugar syrup, Milk solids, Leavening agents (503ii, 500ii), Iodised salt, Emulsifiers (322, 471), Dough conditioner (223)"
    },
    digestive: {
        name: "Digestive Biscuit",
        ingredients: "Whole wheat flour (Atta) (45%), Refined wheat flour, Refined palm oil, Sugar, Wheat bran (4.5%), Invert sugar syrup, Raising agents (503ii, 500ii), Iodised salt, Malt extract, Acidity regulator (270)"
    },
    maggi: {
        name: "Maggi Masala Noodles",
        ingredients: "Refined wheat flour (Maida), Refined palm oil, Iodised salt, Wheat gluten, Mineral (Calcium carbonate), Thickeners (508, 412), Acidity regulators (501i, 500i, 451i), Mixed spices (Dehydrated onion, Coriander powder, Red chilli powder, Turmeric powder, Cumin powder, Aniseed, Black pepper, Fenugreek, Ginger, Clove, Nutmeg, Cardamom), Sugar, Starch, Hydrolysed groundnut protein, Noodle powder, Flavor enhancer (635), Color (150d)"
    },
    bread: {
        name: "Whole Wheat Bread",
        ingredients: "Whole wheat flour (Atta) (55%), Water, Sugar, Yeast, Iodised salt, Wheat gluten, Soya flour, Preservative (282), Emulsifiers (471, 481i), Acidity regulator (270), Vitamin C (Antioxidant)"
    },
    yogurt: {
        name: "Greek Yogurt (Unsweetened)",
        ingredients: "Pasteurized double toned milk, Milk solids, Active live cultures (Streptococcus thermophilus, Lactobacillus delbrueckii subsp. bulgaricus)"
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements - Navigation and Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM Elements - Tab 1 (Quick Compare)
    const p1Name = document.getElementById('p1-name');
    const p1Preset = document.getElementById('p1-preset');
    const p1Ingredients = document.getElementById('p1-ingredients');
    
    const p2Name = document.getElementById('p2-name');
    const p2Preset = document.getElementById('p2-preset');
    const p2Ingredients = document.getElementById('p2-ingredients');
    
    const p3Name = document.getElementById('p3-name');
    const p3Preset = document.getElementById('p3-preset');
    const p3Ingredients = document.getElementById('p3-ingredients');
    
    const btnCompareCustom = document.getElementById('btn-compare-custom');
    const btnClearCustom = document.getElementById('btn-clear-custom');

    // DOM Elements - Results Section
    const compareContent = document.getElementById('compare-content');
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    const bestProductName = document.getElementById('best-product-name');
    const bestProductReason = document.getElementById('best-product-reason');
    const clearAllBtn = document.getElementById('clear-all');
    const exportBtn = document.getElementById('export-btn');
    const aiLoading = document.getElementById('ai-loading');

    await loadConfig();

    // --- TAB SWITCHER LOGIC ---
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            
            btn.classList.add('active');
            const targetId = `${btn.dataset.tab}-tab`;
            document.getElementById(targetId).classList.remove('hidden');
            
            // Hide comparison results when switching tabs unless a custom compare was done
            compareContent.classList.add('hidden');
            
            if (btn.dataset.tab === 'scanned-history') {
                loadScannedComparison();
            }
        });
    });

    // --- PRESET FILL LISTENERS ---
    setupPresetListener(p1Preset, p1Name, p1Ingredients, 'p1');
    setupPresetListener(p2Preset, p2Name, p2Ingredients, 'p2');
    setupPresetListener(p3Preset, p3Name, p3Ingredients, 'p3');

    setupIngredientsListener(p1Ingredients, 'p1');
    setupIngredientsListener(p2Ingredients, 'p2');
    setupIngredientsListener(p3Ingredients, 'p3');

    function setupIngredientsListener(ingredientsInput, productKey) {
        if (!ingredientsInput) return;
        ingredientsInput.addEventListener('input', (e) => {
            extractedIngredients[productKey] = e.target.value.trim();
        });
    }

    function setProductIngredients(productKey, ingredientsInput, ingredientsText) {
        extractedIngredients[productKey] = ingredientsText || '';
        if (ingredientsInput) {
            ingredientsInput.value = ingredientsText || '';
        }
    }

    function setupPresetListener(presetSelect, nameInput, ingredientsInput, productKey) {
        presetSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val && PRESETS[val]) {
                nameInput.value = PRESETS[val].name;
                setProductIngredients(productKey, ingredientsInput, PRESETS[val].ingredients);
            } else {
                nameInput.value = '';
                setProductIngredients(productKey, ingredientsInput, '');
            }
        });
    }

    // --- RESET FIELDS ACTION ---
    btnClearCustom.addEventListener('click', () => {
        [p1Name, p2Name, p3Name].forEach(input => input.value = '');
        [p1Preset, p2Preset, p3Preset].forEach(sel => sel.value = '');
        [p1Ingredients, p2Ingredients, p3Ingredients].forEach(input => {
            if (input) input.value = '';
        });
        // Clear extracted ingredients
        extractedIngredients.p1 = '';
        extractedIngredients.p2 = '';
        extractedIngredients.p3 = '';
        // Clear uploaded images
        uploadedImages.p1 = null;
        uploadedImages.p2 = null;
        uploadedImages.p3 = null;
        // Clear file inputs and previews
        document.getElementById('p1-file').value = '';
        document.getElementById('p2-file').value = '';
        document.getElementById('p3-file').value = '';
        document.getElementById('p1-file-name').textContent = 'No file chosen';
        document.getElementById('p2-file-name').textContent = 'No file chosen';
        document.getElementById('p3-file-name').textContent = 'No file chosen';
        // Remove image previews
        document.querySelectorAll('.image-preview').forEach(el => el.remove());
        compareContent.classList.add('hidden');
    });

    // --- COMPARE CUSTOM ACTION ---
    btnCompareCustom.addEventListener('click', async () => {
        const productSlots = [
            { key: 'p1', nameInput: p1Name, ingredientsInput: p1Ingredients, defaultName: 'Product 1' },
            { key: 'p2', nameInput: p2Name, ingredientsInput: p2Ingredients, defaultName: 'Product 2' },
            { key: 'p3', nameInput: p3Name, ingredientsInput: p3Ingredients, defaultName: 'Product 3' }
        ];

        const products = [];

        for (const slot of productSlots) {
            const ingredientsText = (slot.ingredientsInput?.value || extractedIngredients[slot.key] || '').trim();
            const hasImage = !!(uploadedImages[slot.key] || uploadedImageData[slot.key]);

            if (hasImage && !ingredientsText) {
                alert(`${slot.defaultName}: image uploaded but ingredients are missing. Choose a preset, paste ingredients manually, or add your Gemini API key to .env1 for AI extraction.`);
                return;
            }

            if (ingredientsText) {
                extractedIngredients[slot.key] = ingredientsText;
                products.push({
                    name: slot.nameInput.value.trim() || slot.defaultName,
                    ingredientsText
                });
            }
        }

        if (products.length < 2) {
            alert('Please provide ingredients for at least 2 products (via preset, manual paste, or image AI analysis).');
            return;
        }

        // Show loading and display results content
        compareContent.classList.remove('hidden');
        bestProductName.textContent = 'Comparing Products...';
        bestProductReason.textContent = 'Synthesizing ingredient labels...';
        aiLoading.classList.remove('hidden');

        // Scroll to results dynamically
        bestProductName.scrollIntoView({ behavior: 'smooth' });

        try {
            if (isDemoMode) {
                // OFFLINE ENGINE
                await delay(1500);
                const results = runLocalIngredientsComparison(products);
                renderCustomComparison(results.products, results.bestProduct);
            } else {
                // LIVE GEMINI COMPARISON
                const results = await getLiveAIComparison(products);
                renderCustomComparison(results.products, results.bestProduct);
            }
        } catch (err) {
            console.error('Comparison error:', err);
            // Fallback to offline engine in case of API failure
            const results = runLocalIngredientsComparison(products);
            results.bestProduct.reasoning = `⚠️ Live analysis failed (${err.message}). Showing local ingredients comparison:\n\n${results.bestProduct.reasoning}`;
            renderCustomComparison(results.products, results.bestProduct);
        } finally {
            aiLoading.classList.add('hidden');
        }
    });

    // --- SCANNED HISTORY LOGIC (ORIGINAL) ---
    function loadScannedComparison() {
        const compareList = JSON.parse(localStorage.getItem('nd_compare_list') || '[]');
        const compareEmpty = document.getElementById('compare-empty');

        if (compareList.length === 0) {
            compareEmpty.classList.remove('hidden');
            compareContent.classList.add('hidden');
            return;
        }

        compareEmpty.classList.add('hidden');
        compareContent.classList.remove('hidden');
        renderHistoryComparison(compareList);
    }

    async function renderHistoryComparison(list) {
        const sorted = [...list].sort((a, b) => b.score - a.score);
        const best = sorted[0];

        bestProductName.textContent = best.name;
        aiLoading.classList.remove('hidden');
        bestProductReason.textContent = 'Analyzing nutritional data...';
        
        try {
            // Re-use prompt for history list
            const aiRecommendation = await getAIRecommendation(list);
            bestProductReason.textContent = aiRecommendation;
        } catch (error) {
            console.error('Failed to get AI recommendation:', error);
            bestProductReason.textContent = best.recommendation || 'Based on overall health score and nutritional analysis.';
        } finally {
            aiLoading.classList.add('hidden');
        }

        buildComparisonTable(list, best);
    }

    // --- SHARED UI TABLE BUILDER ---
    function buildComparisonTable(list, best) {
        // Reset Table
        tableHeader.innerHTML = '<th>Metric</th>';
        tableBody.innerHTML = '';

        // Add Product Headers
        list.forEach(product => {
            const th = document.createElement('th');
            th.innerHTML = `
                <div class="product-col-header">
                    <span class="product-name-txt">${product.name}</span>
                    <span class="compare-score-badge ${product.gradeClass || 'badge-neutral'}">${product.score}/100</span>
                </div>
            `;
            tableHeader.appendChild(th);
        });

        // Metrics to display
        const metrics = [
            { label: 'Health Score', key: 'score' },
            { label: 'Grade', key: 'grade' },
            { label: 'Sugar', nut: 'sugar' },
            { label: 'Saturated Fat', nut: 'saturated fat' },
            { label: 'Sodium', nut: 'sodium' },
            { label: 'Protein', nut: 'protein' },
            { label: 'Fiber', nut: 'fiber' },
            { label: 'Ingredient Risks', custom: 'ingredients' }
        ];

        metrics.forEach(metric => {
            const tr = document.createElement('tr');
            if (metric.label === 'Health Score') tr.classList.add('winner-row');
            
            tr.innerHTML = `<td><strong>${metric.label}</strong></td>`;

            list.forEach(product => {
                const td = document.createElement('td');
                let value = 'N/A';

                if (metric.key) {
                    value = product[metric.key];
                    if (metric.key === 'score' && product.score === best.score) {
                        value = `<strong>${value}</strong> <span class="winner-pill">Best</span>`;
                    }
                } else if (metric.nut) {
                    const nutKey = Object.keys(product.nutrients || {}).find(k => k.toLowerCase().includes(metric.nut));
                    value = nutKey ? product.nutrients[nutKey] : 'N/A';
                } else if (metric.custom === 'ingredients') {
                    // Summarize risks
                    const risks = (product.ingredients || [])
                        .filter(i => i.riskClass === 'badge-danger' || i.riskClass === 'badge-warning')
                        .map(i => `<span class="insight-badge ${i.riskClass}" style="margin:2px; font-size:10px;">${i.name}</span>`)
                        .join(' ');
                    value = risks || '<span class="insight-badge badge-good">Low Risk</span>';
                }

                td.innerHTML = value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // --- RENDER CUSTOM COMPARISON RESULTS ---
    function renderCustomComparison(products, bestProduct) {
        bestProductName.textContent = bestProduct.name;
        
        // Convert reasoning from Markdown bold to HTML bold dynamically
        let reasonHtml = bestProduct.reasoning || '';
        reasonHtml = reasonHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        bestProductReason.innerHTML = reasonHtml;

        // Find the best item in our evaluated list to pass to table builder
        const bestObj = products.find(p => p.name.toUpperCase() === bestProduct.name.toUpperCase()) || products[0];
        
        buildComparisonTable(products, bestObj);
    }

    // --- LOCAL INGREDIENTS COMPARISON ENGINE (OFFLINE MODE) ---
    function runLocalIngredientsComparison(productsList) {
        const evaluated = productsList.map(p => analyzeIngredientsOffline(p.name, p.ingredientsText));
        
        // Sort to find the best
        const sorted = [...evaluated].sort((a, b) => b.score - a.score);
        const best = sorted[0];
        
        // Generate comparative reasoning
        let reasoning = `Based on an analysis of ingredient labels, **${best.name}** is the healthiest choice with a health score of **${best.score}/100** (${best.grade}). `;
        if (best.positiveFindings.length > 0) {
            reasoning += `It features beneficial ingredients like ${best.positiveFindings.slice(0, 3).join(', ')}. `;
        }
        
        const others = evaluated.filter(p => p.name !== best.name);
        others.forEach(other => {
            const keyNegatives = other.negativeFindings.slice(0, 2);
            if (keyNegatives.length > 0) {
                reasoning += `By comparison, **${other.name}** contains less favorable ingredients such as ${keyNegatives.join(' and ')}, lowering its nutrient profile. `;
            } else {
                reasoning += `By comparison, **${other.name}** (${other.score}/100) has a lower concentration of active beneficial compounds. `;
            }
        });

        return {
            products: evaluated,
            bestProduct: {
                name: best.name.toUpperCase(),
                reasoning: reasoning
            }
        };
    }

    function analyzeIngredientsOffline(name, ingredientsText) {
        const ingredients = [];
        const lowerText = ingredientsText.toLowerCase();
        
        let score = 65; // base score
        let positiveFindings = [];
        let negativeFindings = [];
        
        // Look for positive ingredients
        const positiveRules = [
            { pattern: /whole\s*(wheat|grain|oat)/, name: "Whole Grains", desc: "Rich in fiber and complex carbohydrates.", points: 12 },
            { pattern: /oat|bran|fiber|fibre/, name: "Dietary Fiber", desc: "Helps with digestion and satiety.", points: 8 },
            { pattern: /active\s*cultures|probiotics|yogurt\s*cultures/, name: "Active Probiotics", desc: "Supports gut microbiome health.", points: 15 },
            { pattern: /milk\s*solids|milk\s*protein|whey/, name: "Dairy Protein", desc: "Good source of high quality protein.", points: 8 },
            { pattern: /calcium|iron|vitamin|mineral|potassium|zinc/, name: "Essential Micronutrients", desc: "Enriched with beneficial vitamins and minerals.", points: 6 },
            { pattern: /seeds|nuts|cocoa/, name: "Healthy Fats & Antioxidants", desc: "Provides essential fatty acids or natural antioxidants.", points: 8 }
        ];
        
        // Look for negative ingredients
        const negativeRules = [
            { pattern: /sugar|syrup|fructose|glucose|sucrose|dextrose/, name: "Added Sugar / Sweeteners", desc: "High amounts of refined sugars contribute to glycemic load and empty calories.", points: -15, risk: "High", riskClass: "badge-danger" },
            { pattern: /palm\s*oil|hydrogenated/, name: "Processed Saturated Fats", desc: "Contains palm oil or hydrogenated fats associated with cardiovascular risks.", points: -12, risk: "High", riskClass: "badge-danger" },
            { pattern: /refined\s*(wheat\s*)?flour|maida/, name: "Refined Carbohydrates", desc: "Maida/refined flour is stripped of fiber, leading to rapid blood sugar spikes.", points: -10, risk: "Moderate", riskClass: "badge-warning" },
            { pattern: /artificial\s*(flavor|flavour|color|colour)/, name: "Artificial Additives", desc: "Contains synthetic chemicals for taste/appearance.", points: -8, risk: "Moderate", riskClass: "badge-warning" },
            { pattern: /preservative|282|sulfite/, name: "Preservatives", desc: "Chemical preservatives added for shelf life expansion.", points: -5, risk: "Moderate", riskClass: "badge-warning" },
            { pattern: /msg|flavor\s*enhancer|635/, name: "Flavor Enhancers", desc: "Chemical additives like MSG used to artificially enhance palatability.", points: -10, risk: "High", riskClass: "badge-danger" },
            { pattern: /acidity\s*regulator|stabilizer|emulsifier|thickener/, name: "Stabilizers & Regulators", desc: "Additives used to manage texture and acidity.", points: -4, risk: "Neutral", riskClass: "badge-neutral" },
            { pattern: /salt|sodium/, name: "Sodium / Salts", desc: "Added sodium contributing to daily salt intake limits.", points: -6, risk: "Moderate", riskClass: "badge-warning" }
        ];
        
        positiveRules.forEach(rule => {
            if (rule.pattern.test(lowerText)) {
                score += rule.points;
                positiveFindings.push(rule.name);
                ingredients.push({
                    name: rule.name,
                    risk: "Neutral",
                    riskClass: "badge-good",
                    desc: rule.desc
                });
            }
        });
        
        negativeRules.forEach(rule => {
            if (rule.pattern.test(lowerText)) {
                score += rule.points;
                negativeFindings.push(rule.name);
                ingredients.push({
                    name: rule.name,
                    risk: rule.risk,
                    riskClass: rule.riskClass,
                    desc: rule.desc
                });
            }
        });
        
        score = Math.max(10, Math.min(100, score));
        
        let grade, gradeClass, ringClass;
        if (score >= 75) {
            grade = "Good"; gradeClass = "badge-good"; ringClass = "score-good";
        } else if (score >= 45) {
            grade = "Moderate"; gradeClass = "badge-average"; ringClass = "score-average";
        } else {
            grade = "Low"; gradeClass = "badge-poor"; ringClass = "score-poor";
        }
        
        // Sort ingredients list by risk level (Danger -> Warning -> Neutral -> Success)
        const weightMap = { "badge-danger": 4, "badge-warning": 3, "badge-neutral": 2, "badge-good": 1 };
        ingredients.sort((a, b) => (weightMap[b.riskClass] || 0) - (weightMap[a.riskClass] || 0));
        
        // Pick top 4 ingredient highlights
        const topIngredients = ingredients.slice(0, 4);
        
        return {
            name: name || "Unknown Product",
            score,
            grade,
            gradeClass,
            ringClass,
            ingredients: topIngredients,
            positiveFindings,
            negativeFindings,
            // Display metrics in comparison table
            nutrients: {
                "Sugar": lowerText.includes("sugar") || lowerText.includes("syrup") ? "High Sugar" : "Low Sugar",
                "Sodium": lowerText.includes("salt") || lowerText.includes("sodium") ? "Moderate Sodium" : "Low Sodium",
                "Saturated Fat": lowerText.includes("palm") || lowerText.includes("hydrogenated") ? "High Sat Fat" : "Low Sat Fat",
                "Protein": lowerText.includes("milk") || lowerText.includes("protein") || lowerText.includes("gluten") ? "Source of Protein" : "N/A",
                "Fiber": lowerText.includes("wheat") || lowerText.includes("bran") || lowerText.includes("fiber") || lowerText.includes("oat") ? "Source of Fiber" : "N/A"
            }
        };
    }

    // --- LIVE AI COMPARISON GENERATION ---
    async function getLiveAIComparison(products) {
        const productsData = products.map((p, index) => {
            return `Product ${index + 1}: ${p.name}
- Ingredients Label Text: ${p.ingredientsText}`;
        }).join('\n\n');

        const prompt = `You are a clinical nutritionist and food safety scientist comparing the ingredient labels of up to 3 packaged food products.
        
Analyze their ingredients and return a JSON object with this exact structure:
{
  "products": [
    {
      "name": "REAL PRODUCT NAME",
      "score": 75, // integer health score (0-100) based on ingredients healthiness
      "grade": "Good", // "Good", "Moderate", or "Low"
      "gradeClass": "badge-good", // "badge-good", "badge-average", or "badge-poor"
      "ringClass": "score-good", // "score-good", "score-average", or "score-poor"
      "nutrients": {
        "Sugar": "e.g. High Sugar or Low Sugar",
        "Sodium": "e.g. Moderate Sodium or Low Sodium",
        "Saturated Fat": "e.g. High Sat Fat or Low Sat Fat",
        "Protein": "e.g. Source of Protein or N/A",
        "Fiber": "e.g. Source of Fiber or N/A"
      },
      "ingredients": [
        {
          "name": "Palm Oil",
          "risk": "Moderate", // "High", "Moderate", or "Neutral"
          "riskClass": "badge-warning", // "badge-danger", "badge-warning", "badge-neutral", or "badge-good"
          "desc": "Saturated fat source linked to metabolic strains."
        }
      ]
    }
  ],
  "bestProduct": {
    "name": "REAL NAME OF THE BEST PRODUCT",
    "reasoning": "Write a 2-3 sentence explanation why this product is the healthiest choice, directly comparing key ingredient differences (e.g., fewer chemical additives, higher whole grains, lower refined sugar/salt, no palm oil) between all options."
  }
}

Compare these products:
${productsData}

Return ONLY raw JSON, do not wrap it in markdown code blocks like \`\`\`json.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const rawText = data.candidates[0].content.parts[0].text;
            return parseJsonResponse(rawText);
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    }

    function parseJsonResponse(rawText) {
        let cleaned = rawText.trim();
        const startIdx = cleaned.indexOf('{');
        const endIdx = cleaned.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            cleaned = cleaned.substring(startIdx, endIdx + 1);
        }
        return JSON.parse(cleaned);
    }

    // --- GEMINI API FOR HISTORICAL COMPARISON ---
    async function getAIRecommendation(products) {
        const productsData = products.map((p, index) => {
            const nutrients = p.nutrients || {};
            const nutrientStr = Object.entries(nutrients)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            
            return `Product ${index + 1}: ${p.name}
- Health Score: ${p.score}/100
- Grade: ${p.grade}
- Nutrients (per 100g): ${nutrientStr || 'Not available'}
- Ingredients: ${p.ingredients ? p.ingredients.map(i => i.name).join(', ') : 'Not available'}`;
        }).join('\n\n');

        const prompt = `You are a nutrition expert analyzing packaged food products. Based on the following product comparison data, provide a concise, insightful recommendation (2-3 sentences) explaining which product is the healthiest choice and why. Focus on key nutritional differences, processing levels, and health impacts.

${productsData}

Provide your analysis in a clear, consumer-friendly manner that helps someone make an informed decision.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 256,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format');
        }
    }

    // --- CLEAR LOCAL STORAGE ACTION ---
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your comparison list?')) {
            localStorage.removeItem('nd_compare_list');
            loadScannedComparison();
        }
    });

    // --- EXPORT TO IMAGE ACTION ---
    exportBtn.addEventListener('click', async () => {
        const exportableContent = document.getElementById('compare-content');
        
        // Show loading state
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = `
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Generating...
        `;
        exportBtn.disabled = true;

        try {
            // Create a canvas container for the export
            const canvas = await html2canvas(exportableContent, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false,
                windowHeight: exportableContent.scrollHeight,
                windowWidth: exportableContent.scrollWidth
            });

            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    const timestamp = new Date().toISOString().slice(0, 10);
                    link.download = `nature-decoder-comparison-${timestamp}.png`;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');

        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export comparison. Please try again.');
        } finally {
            // Restore button state
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        }
    });

    // --- UTILITY LOAD CONFIG ---
    async function loadConfig() {
        // Prefer parent app .env, then compare-local .env1 override
        await fetchEnvFile('../.env');
        if (!isValidApiKey(GEMINI_API_KEY)) {
            await fetchEnvFile('./.env1');
        }

        applyGeminiEndpoints();
        isDemoMode = !isValidApiKey(GEMINI_API_KEY);

        if (isDemoMode) {
            console.log('Compare Screen: Demo Mode. Serve via local server and set GEMINI_API_KEY in ../.env or compare/.env1.');
        } else {
            console.log(`Compare Screen: Live AI ready (${GEMINI_MODEL}).`);
        }

        updateApiStatus();
    }

    function updateApiStatus() {
        const statusEl = document.getElementById('api-status');
        if (!statusEl) return;

        statusEl.classList.remove('hidden', 'api-status-live', 'api-status-demo');

        if (isDemoMode) {
            statusEl.classList.add('api-status-demo');
            statusEl.innerHTML = `
                <span class="api-status-dot"></span>
                <span>Demo mode — run <code>npm run start</code> in the compare folder, then open <code>/compare/compare.html</code></span>
            `;
            if (btnCompareCustom) {
                const label = btnCompareCustom.querySelector('span');
                if (label) label.textContent = 'Compare Ingredients';
            }
        } else {
            statusEl.classList.add('api-status-live');
            statusEl.innerHTML = `
                <span class="api-status-dot"></span>
                <span>AI ready — upload label images and ingredients will be extracted automatically</span>
            `;
            if (btnCompareCustom) {
                const label = btnCompareCustom.querySelector('span');
                if (label) label.textContent = 'Compare with AI';
            }
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- IMAGE UPLOAD FUNCTIONALITY WITH AI ANALYSIS ---
    // Store uploaded images for AI re-analysis
    const uploadedImageData = { p1: null, p2: null, p3: null };
    
    const uploadZones = [
        { btn: document.getElementById('p1-upload-btn'), file: document.getElementById('p1-file'), name: document.getElementById('p1-file-name'), nameInput: p1Name, ingredientsInput: p1Ingredients, previewContainer: document.getElementById('p1-upload-zone'), key: 'p1' },
        { btn: document.getElementById('p2-upload-btn'), file: document.getElementById('p2-file'), name: document.getElementById('p2-file-name'), nameInput: p2Name, ingredientsInput: p2Ingredients, previewContainer: document.getElementById('p2-upload-zone'), key: 'p2' },
        { btn: document.getElementById('p3-upload-btn'), file: document.getElementById('p3-file'), name: document.getElementById('p3-file-name'), nameInput: p3Name, ingredientsInput: p3Ingredients, previewContainer: document.getElementById('p3-upload-zone'), key: 'p3' }
    ];

    // Helper: Analyze product image with Gemini Vision API
    async function analyzeProductImage(imageDataUrl, productName) {
        if (isDemoMode || !GEMINI_API_KEY) {
            throw new Error('AI analysis requires a valid Gemini API key. Please add your API key to .env1 file.');
        }

        const base64Content = imageDataUrl.split(',')[1];
        const mimeType = imageDataUrl.substring(5, imageDataUrl.indexOf(';'));

        const prompt = `You are a nutrition expert analyzing a packaged food product label image.

Read the product name and the full INGREDIENTS list from the label (usually on the back of the package).
Return ONLY a valid JSON object (no markdown, no code blocks):
{
  "productName": "The exact product name from the label",
  "ingredients": "Complete ingredients list exactly as printed, comma-separated"
}

${productName ? `Hint: the product may be named "${productName}". Verify from the image.` : ''}

Rules:
- Prioritize the ingredients list text over nutrition facts table.
- If multiple languages appear, use English.
- If text is partially unreadable, transcribe what is visible and note uncertainty in the productName only.
- Do not invent ingredients that are not visible on the label.`;

        try {
            const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64Content
                                }
                            }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Gemini API error (${response.status}): ${errorBody.slice(0, 200)}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const rawText = data.candidates[0].content.parts[0].text;
                let cleaned = rawText.trim();
                const startIdx = cleaned.indexOf('{');
                const endIdx = cleaned.lastIndexOf('}');
                if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                    cleaned = cleaned.substring(startIdx, endIdx + 1);
                }
                return JSON.parse(cleaned);
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Image analysis error:', error);
            throw error;
        }
    }

    // Global function for re-analyzing images
    window.reanalyzeImage = async function(productKey) {
        const zone = uploadZones.find(z => z.key === productKey);
        if (!zone || !uploadedImageData[productKey]) return;
        
        const preview = zone.previewContainer.querySelector('.image-preview');
        
        // Show loading state
        preview.innerHTML = `
            <img src="${uploadedImageData[productKey]}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
            <div style="margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <div style="width: 16px; height: 16px; border: 2px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 12px; color: var(--primary);">Re-analyzing...</span>
            </div>
        `;
        
        try {
            const currentProductName = zone.nameInput.value.trim();
            const analysisResult = await analyzeProductImage(uploadedImageData[productKey], currentProductName);
            
            if (analysisResult.productName) {
                zone.nameInput.value = analysisResult.productName;
            }
            if (analysisResult.ingredients) {
                setProductIngredients(productKey, zone.ingredientsInput, analysisResult.ingredients);
            }
            
            preview.innerHTML = `
                <img src="${uploadedImageData[productKey]}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                <p style="font-size: 12px; color: #10b981; margin-top: 8px;">✓ AI analysis complete!</p>
            `;
        } catch (error) {
            preview.innerHTML = `
                <img src="${uploadedImageData[productKey]}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                <p style="font-size: 12px; color: #ef4444; margin-top: 8px;">Analysis failed: ${error.message}</p>
            `;
        }
    };

    uploadZones.forEach(zone => {
        // Click upload button to trigger file input
        zone.btn.addEventListener('click', (e) => {
            e.preventDefault();
            zone.file.click();
        });

        // Handle file selection with AI analysis
        zone.file.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                zone.name.textContent = file.name;
                
                // Read and display image preview
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const imageData = event.target.result;
                    
                    // Store image data for comparison and potential re-analysis
                    uploadedImageData[zone.key] = imageData;
                    uploadedImages[zone.key] = imageData;
                    
                    // Create or update image preview with loading state
                    let preview = zone.previewContainer.querySelector('.image-preview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.style.cssText = 'margin-top: 12px; text-align: center;';
                        zone.previewContainer.appendChild(preview);
                    }
                    
                    // Show preview with loading indicator for AI analysis
                    preview.innerHTML = `
                        <img src="${imageData}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <div style="width: 16px; height: 16px; border: 2px solid var(--primary); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <span style="font-size: 12px; color: var(--primary);">Analyzing with AI...</span>
                        </div>
                    `;
                    
                    // Try AI analysis if API is configured
                    if (!isDemoMode && GEMINI_API_KEY) {
                        try {
                            const currentProductName = zone.nameInput.value.trim();
                            const analysisResult = await analyzeProductImage(imageData, currentProductName);
                            
                            // Auto-fill the fields with AI-extracted data
                            if (analysisResult.productName) {
                                zone.nameInput.value = analysisResult.productName;
                            }
                            if (analysisResult.ingredients) {
                                setProductIngredients(zone.key, zone.ingredientsInput, analysisResult.ingredients);
                            }
                            
                            // Update preview to show success
                            preview.innerHTML = `
                                <img src="${imageData}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                                
                                <p style="font-size: 12px; color: #10b981; margin-top: 8px;">✓ AI analysis complete! Ready to compare.</p>
                                <button type="button" class="btn-reanalyze" onclick="reanalyzeImage('${zone.key}')" style="margin-top: 6px; font-size: 11px; color: var(--primary); background: none; border: none; cursor: pointer; text-decoration: underline;">Re-analyze</button>
                            `;
                        } catch (error) {
                            console.warn('AI analysis failed:', error.message);
                            preview.innerHTML = `
                                <img src="${imageData}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                                <p style="font-size: 12px; color: #ef4444; margin-top: 8px;">Analysis failed: ${error.message}</p>
                            `;
                        }
                    } else {
                        // Demo mode - image stored; user can pick preset or paste ingredients
                        preview.innerHTML = `
                            <img src="${imageData}" alt="Preview" style="max-width: 100%; max-height: 150px; border-radius: 8px; border: 1px solid var(--border);">
                            <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">Image saved. Choose a preset or paste ingredients below, then click Compare.</p>
                        `;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                zone.name.textContent = 'No file chosen';
            }
        });
    });

    // Default initialization
    const compareList = JSON.parse(localStorage.getItem('nd_compare_list') || '[]');
    // If we have scanner items, history tab is available but custom quick compare remains the default loaded tab
});
