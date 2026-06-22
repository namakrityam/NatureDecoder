// App State
const state = {
  productName: '',
  hasImage: false,
  imageFile: null,
  isAnalyzing: false,
  currentReportData: null,

  // Gemini API credentials loaded from .env
  config: {
    GEMINI_API_KEY: '',
    GEMINI_MODEL: 'gemini-2.5-flash'
  },
  isDemoMode: true
};

// DOM Elements
const screenInput = document.getElementById('screen-input');
const screenResult = document.getElementById('screen-result');
const inputProductName = document.getElementById('product-name');
const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');
const uploadEmpty = document.getElementById('upload-empty');
const uploadPreviewContainer = document.getElementById('upload-preview-container');
const imagePreview = document.getElementById('image-preview');
const previewFilename = document.getElementById('preview-filename');
const previewFilesize = document.getElementById('preview-filesize');
const btnRemove = document.getElementById('btn-remove');
const btnAnalyze = document.getElementById('btn-analyze');

// Screen 2 elements
const analyzingState = document.getElementById('analyzing-state');
const resultContent = document.getElementById('result-content');
const progressCircle = document.querySelector('.circle-progress');
const btnBackToScan = document.getElementById('btn-back-to-scan');

// Result Screen fields
const resProductName = document.getElementById('result-product-name');
const resDate = document.getElementById('result-date');
const resScore = document.getElementById('result-score');
const resGradeText = document.getElementById('result-grade-text');
const resGradeBadge = document.getElementById('result-grade-badge');
const scoreCircleFill = document.getElementById('score-circle-fill');
const resAssessmentDesc = document.getElementById('result-assessment-desc');

// Dynamic elements
const nutritionGrid = document.getElementById('nutrition-grid');
const resIngredientsList = document.getElementById('result-ingredients-list');
const resRecommendation = document.getElementById('result-recommendation');

// Download actions
const btnDownloadPdf = document.getElementById('btn-download-pdf');
const btnDownloadDocx = document.getElementById('btn-download-docx');

// Animation Coordination State
let currentProgress = 0;
let targetProgress = 0;
let animationFrameId = null;

/* -------------------------------------------------------------
 * CONFIG LOADER (.env parser)

 * ------------------------------------------------------------- */
async function loadConfig() {
  try {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let response;
    if (isLocal) {
      response = await fetch('/.env');
      if (!response.ok) {
        response = await fetch('/api/env');
      }
    } else {
      response = await fetch('/api/env');
    }
    if (!response.ok) {
      console.warn('.env file not found, falling back to Demo Mode.');
      state.isDemoMode = true;
      return;
    }
    const text = await response.text();
    text.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const separatorIdx = trimmed.indexOf('=');
      if (separatorIdx === -1) return;

      const key = trimmed.substring(0, separatorIdx).trim();
      const value = trimmed.substring(separatorIdx + 1).trim();

      // Clean up surrounding quotes if present
      const cleanVal = value.replace(/^["']|["']$/g, '');
      if (key in state.config) {
        state.config[key] = cleanVal;
      }
    });

    const key = state.config.GEMINI_API_KEY;
    if (key && key !== 'your_gemini_api_key_here' && key !== '') {
      state.isDemoMode = false;
      console.log('Gemini API configured successfully. Mode: LIVE AI.');
    } else {
      state.isDemoMode = true;
      console.log('No valid API Key found in .env. Mode: DEMO OFFLINE.');
    }
  } catch (err) {
    console.error('Error loading config, starting in demo mode:', err);
    state.isDemoMode = true;
  }
}

// Initial config loading
document.addEventListener('DOMContentLoaded', loadConfig);

/* -------------------------------------------------------------
 * CORE VALIDATION AND STATE UPDATE
 * ------------------------------------------------------------- */
function updateFormValidation() {
  state.productName = inputProductName.value.trim();
  const isValid = state.productName.length > 0 && state.hasImage;
  btnAnalyze.disabled = !isValid;
}

// Listen to input changes
inputProductName.addEventListener('input', updateFormValidation);

/* -------------------------------------------------------------
 * FILE UPLOAD & PREVIEW MANAGEMENT
 * ------------------------------------------------------------- */
uploadZone.addEventListener('click', (e) => {
  if (e.target.closest('#btn-remove') || e.target === fileInput) return;
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFileSelection(file);
});

['dragenter', 'dragover'].forEach(eventName => {
  uploadZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.add('dragover');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  uploadZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('dragover');
  }, false);
});

uploadZone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const file = dt.files[0];
  handleFileSelection(file);
});

function handleFileSelection(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPEG, PNG, WEBP).');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('Image size exceeds 10MB. Please upload a smaller image.');
    return;
  }

  state.imageFile = file;
  state.hasImage = true;

  previewFilename.textContent = file.name;
  previewFilesize.textContent = formatBytes(file.size);

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    uploadEmpty.classList.add('hidden');
    uploadPreviewContainer.classList.remove('hidden');
    updateFormValidation();
  };
  reader.readAsDataURL(file);
}

btnRemove.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  resetUploadState();
});

function resetUploadState() {
  fileInput.value = '';
  imagePreview.src = '#';
  state.imageFile = null;
  state.hasImage = false;

  uploadPreviewContainer.classList.add('hidden');
  uploadEmpty.classList.remove('hidden');
  updateFormValidation();
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* -------------------------------------------------------------
 * NUTRIENT ICON & VISUAL STYLE MAPPER
 * ------------------------------------------------------------- */
function getNutrientStyle(name) {
  const norm = name.toLowerCase();

  // Default fallbacks
  let iconHtml = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;
  let iconClass = "blue-icon";

  if (norm.includes('calor') || norm.includes('energ')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    iconClass = "red-icon";
  } else if (norm.includes('sugar')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    iconClass = "orange-icon";
  } else if (norm.includes('fat') || norm.includes('lipid')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 12 2 12 2C12 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    iconClass = "yellow-icon";
  } else if (norm.includes('sodium') || norm.includes('salt')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v18M3 12h18M12 3a9 9 0 0 1 9 9M12 21a9 9 0 0 1-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
    iconClass = "blue-icon";
  } else if (norm.includes('protein')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18H18M6 14H18M6 10H18M6 6H18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
    iconClass = "green-icon";
  } else if (norm.includes('fiber') || norm.includes('fibre')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M12 6v10M9 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    iconClass = "green-icon";
  } else if (norm.includes('carb')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2.5"/>
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" stroke-width="2"/>
      </svg>
    `;
    iconClass = "orange-icon";
  } else if (norm.includes('cholest')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
    `;
    iconClass = "red-icon";
  } else if (norm.includes('vit')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    iconClass = "green-icon";
  } else if (norm.includes('calcium') || norm.includes('iron') || norm.includes('potassium') || norm.includes('zinc')) {
    iconHtml = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v10M12 13l4-4M12 13l-4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 20h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
    iconClass = "blue-icon";
  }

  return { iconHtml, iconClass };
}

/* -------------------------------------------------------------
 * GOOGLE GEMINI API INTERACTION PIPELINE (LIVE STATE)
 * ------------------------------------------------------------- */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Single Stage: Call Gemini 1.5 Flash to evaluate image and generate structured JSON report
async function runGeminiAnalysis(imageFile, productName) {
  const apiKey = state.config.GEMINI_API_KEY;
  const initialModel = state.config.GEMINI_MODEL || 'gemini-2.5-flash';

  // List of active Google Gemini models to try in case of 503 spikes or rate limits
  const models = [
    initialModel,
    'gemini-2.0-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite'
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  console.log("Preparing image for Gemini API...");
  const base64DataUrl = await fileToBase64(imageFile);
  const mimeType = base64DataUrl.substring(5, base64DataUrl.indexOf(';'));
  const base64Content = base64DataUrl.split(',')[1];

  const systemPrompt = `You are an expert clinical nutritionist and food safety scientist analyzing a product named "${productName}". 

Review the attached packaging label image and extract the actual nutrients, values, and ingredients directly from the image.
If the image is unreadable, estimate the real nutritional values and ingredients for the product named "${productName}".

You MUST respond ONLY with a valid, raw JSON object. Your entire response must be parseable by JSON.parse().
Do NOT calculate a score. Do NOT assign risk tags. The application will handle the math.

The JSON structure must exactly match this format:
{
  "name": "REAL PRODUCT NAME",
  "nutrients": {
    "Nutrient Name 1": "extracted value with unit",
    "Nutrient Name 2": "extracted value with unit"
  },
  "ingredients": [
    "Ingredient Name 1",
    "Ingredient Name 2"
  ],
  "ai_recommendation": "A friendly, helpful, non-technical recommendation explaining whether the product is suitable for children/teenagers/adults, and if it should be occasional or frequent."
}

CRITICAL RULES:
1. Under the "nutrients" object, extract and list ALL nutrients found. Ensure values have correct units (e.g. kcal, g, mg, mcg, %).
2. Under "ingredients", list just the string names of the ingredients.
3. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Return only raw JSON.
`;

  let lastError = null;

  for (const model of models) {
    let timeoutId = null;
    try {
      console.log(`Attempting Vision & Reasoning Analysis with Gemini API model: ${model}`);
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(`Gemini model ${model} timed out after 35s`);
      }, 35000);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              parts: [
                { text: `Please extract the ingredients and nutritional data from this image for ${productName}.` },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Content
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        clearTimeout(timeoutId);
        throw new Error(errData.error?.message || `Status: ${response.status}`);
      }

      const data = await response.json();
      clearTimeout(timeoutId);
      console.warn(`Gemini API raw payload:`, data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error("Invalid response format from Gemini API");
      }
      const content = data.candidates[0].content.parts[0].text;
      if (content === null || content === undefined) {
        throw new Error("Model returned null content");
      }
      console.log(`Vision & Reasoning Analysis succeeded using Gemini model: ${model}`);
      return content;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`Gemini model ${model} failed, trying fallback. Error:`, err.message);
      lastError = err;

      // Short pause before hitting the next Gemini model to let the server recover
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  throw new Error(`Gemini analysis failed on all models. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
}

// Deterministic JS Pipeline for cleaning, thresholding, and scoring
function processNutritionalData(raw) {
  let positiveFindings = [];
  let negativeFindings = [];

  const parsedNutrients = {};

  // Helper to extract numeric value from strings like "5g", "10 mg", "120kcal"
  function getVal(str) {
    if (!str) return 0;
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  // --- A. NUTRITION SCORE (0-100, Base 50) ---
  let nutritionScore = 50;
  let nutritionPos = [];
  let nutritionNeg = [];

  for (const [key, valStr] of Object.entries(raw.nutrients || {})) {
    parsedNutrients[key] = valStr; // pass to UI
    const k = key.toLowerCase();
    const val = getVal(valStr);

    if (k.includes('protein')) {
      if (val >= 8) { nutritionScore += 20; nutritionPos.push({ name: "High Protein", points: 20 }); }
      else if (val >= 3) { nutritionScore += 10; nutritionPos.push({ name: "Source of Protein", points: 10 }); }
    }
    if (k.includes('fiber') || k.includes('fibre')) {
      if (val >= 5) { nutritionScore += 20; nutritionPos.push({ name: "High Fiber", points: 20 }); }
      else if (val >= 2) { nutritionScore += 10; nutritionPos.push({ name: "Contains Fiber", points: 10 }); }
    }
    if (k.includes('sodium') || k.includes('salt')) {
      if (val > 400) { nutritionScore -= 20; nutritionNeg.push({ name: "High Sodium", points: -20 }); }
      else if (val > 140) { nutritionScore -= 10; nutritionNeg.push({ name: "Moderate Sodium", points: -10 }); }
      else { nutritionScore += 5; nutritionPos.push({ name: "Low Sodium", points: 5 }); }
    }
    if (k === 'sugar' || k === 'sugars' || k === 'added sugar') {
      if (val > 10) { nutritionScore -= 20; nutritionNeg.push({ name: "High Sugar", points: -20 }); }
      else if (val > 5) { nutritionScore -= 10; nutritionNeg.push({ name: "Moderate Sugar", points: -10 }); }
      else { nutritionScore += 5; nutritionPos.push({ name: "Low Sugar", points: 5 }); }
    }
    if (k.includes('saturated fat')) {
      if (val > 5) { nutritionScore -= 15; nutritionNeg.push({ name: "High Saturated Fat", points: -15 }); }
      else if (val > 2) { nutritionScore -= 5; nutritionNeg.push({ name: "Moderate Saturated Fat", points: -5 }); }
    }
    if (k.includes('trans fat') && val > 0) {
      nutritionScore -= 20; nutritionNeg.push({ name: "Trans Fat", points: -20 });
    }
    if (k.includes('iron') || k.includes('calcium') || k.includes('vitamin') || k.includes('zinc') || k.includes('potassium')) {
      if (val > 0) { nutritionScore += 5; nutritionPos.push({ name: `Contains ${key}`, points: 5 }); }
    }
  }
  nutritionScore = Math.max(0, Math.min(100, nutritionScore));

  // --- B. INGREDIENT SCORE (0-100, Base 70) & C. PROCESSING SCORE (0-100, Base 80) ---
  let ingredientScore = 70;
  let processingScore = 80;

  let ingredientPos = [];
  let ingredientNeg = [];
  let processingNeg = [];

  const ingredientsOutput = [];
  const rawIngs = raw.ingredients || [];
  const penalizedCategories = new Set();

  rawIngs.forEach(ing => {
    const name = typeof ing === 'string' ? ing : ing.name || JSON.stringify(ing);
    const lowerName = name.toLowerCase();

    let risk = "Neutral";
    let riskClass = "badge-neutral";
    let desc = "Standard ingredient.";
    let weight = 1;

    // Processing Score Deductions (Additives & Industrial)
    if (lowerName.includes('artificial flavor') || lowerName.includes('flavor enhancer') || lowerName.includes('msg') || lowerName.includes('hydrolysed') || lowerName.includes('flavour')) {
      risk = "Moderate"; riskClass = "badge-warning"; desc = "Ultra-processed additive.";
      weight = 2;
      if (!penalizedCategories.has('artificial')) { processingScore -= 30; processingNeg.push({ name: "Artificial Additives", points: -30 }); penalizedCategories.add('artificial'); }
    } else if (lowerName.includes('acidity regulator') || lowerName.includes('thickener') || lowerName.includes('stabilizer') || lowerName.includes('emulsifier') || lowerName.includes('color') || lowerName.includes('colour')) {
      risk = "Neutral"; riskClass = "badge-neutral"; desc = "Common food additive.";
      weight = 1;
      if (!penalizedCategories.has('minor_additives')) { processingScore -= 10; processingNeg.push({ name: "Minor Additives", points: -10 }); penalizedCategories.add('minor_additives'); }
    }

    // Ingredient Score Positive
    if (lowerName.includes('whole grain') || lowerName.includes('whole wheat') || lowerName.includes('oat') || lowerName.includes('nuts') || lowerName.includes('seed') || lowerName.includes('whey') || lowerName.includes('milk protein') || lowerName.includes('lentil') || lowerName.includes('chickpea') || lowerName.includes('soy protein') || lowerName.includes('cocoa')) {
      risk = "Neutral"; riskClass = "badge-good"; desc = "Nutrient-dense natural ingredient.";
      weight = 0;
      ingredientScore += 10; ingredientPos.push({ name: name, points: 10 });
    }
    // Ingredient Score Negative
    else if (lowerName.includes('hydrogenated') || lowerName.includes('trans fat')) {
      risk = "High"; riskClass = "badge-danger"; desc = "Harmful processed fat.";
      weight = 3;
      if (!penalizedCategories.has('hydrogenated')) { ingredientScore -= 40; ingredientNeg.push({ name: "Hydrogenated Oil", points: -40 }); penalizedCategories.add('hydrogenated'); }
    } else if (lowerName.includes('high fructose') || lowerName.includes('corn syrup') || lowerName.includes('sugar syrup') || lowerName.includes('glucose syrup')) {
      risk = "High"; riskClass = "badge-danger"; desc = "Highly processed sweetener.";
      weight = 3;
      if (!penalizedCategories.has('hfcs')) { ingredientScore -= 30; ingredientNeg.push({ name: "Processed Sweetener", points: -30 }); penalizedCategories.add('hfcs'); }
    } else if (lowerName.includes('sugar') || lowerName.includes('syrup')) {
      risk = "Moderate"; riskClass = "badge-warning"; desc = "Added sugar.";
      weight = 2;
      if (!penalizedCategories.has('sugar')) { ingredientScore -= 15; ingredientNeg.push({ name: "Added Sugar", points: -15 }); penalizedCategories.add('sugar'); }
    } else if (lowerName.includes('palm oil')) {
      risk = "Moderate"; riskClass = "badge-warning"; desc = "Saturated fat source.";
      weight = 2;
      if (!penalizedCategories.has('palm')) { ingredientScore -= 15; ingredientNeg.push({ name: "Palm Oil", points: -15 }); penalizedCategories.add('palm'); }
    } else if (lowerName.includes('refined flour') || lowerName.includes('maida') || (lowerName.includes('wheat flour') && !lowerName.includes('whole'))) {
      risk = "Moderate"; riskClass = "badge-warning"; desc = "Refined carbohydrate.";
      weight = 2;
      if (!penalizedCategories.has('refined_flour')) { ingredientScore -= 15; ingredientNeg.push({ name: "Refined Flour", points: -15 }); penalizedCategories.add('refined_flour'); }
    }

    ingredientsOutput.push({ name, risk, riskClass, desc, weight });
  });

  ingredientScore = Math.max(0, Math.min(100, ingredientScore));
  processingScore = Math.max(0, Math.min(100, processingScore));

  // Sort and filter ingredients
  ingredientsOutput.sort((a, b) => b.weight - a.weight);

  let topIngredients = [];
  let minorAdditivesCount = 0;

  ingredientsOutput.forEach(ing => {
    if (topIngredients.length < 6) {
      if (ing.weight > 0 || ing.riskClass === "badge-good") {
        topIngredients.push(ing);
      } else {
        minorAdditivesCount++;
      }
    } else {
      minorAdditivesCount++;
    }
  });

  if (minorAdditivesCount > 0) {
    topIngredients.push({
      name: `+ ${minorAdditivesCount} minor additives`,
      risk: "Neutral",
      riskClass: "badge-neutral",
      desc: "Other minor ingredients (like stabilizers or acidity regulators) were also present."
    });
  }

  topIngredients = topIngredients.map(i => ({ name: i.name, risk: i.risk, riskClass: i.riskClass, desc: i.desc }));

  // --- FINAL SCORE COMBINATION ---
  // Nutrition Score × 0.60 + Ingredient Score × 0.25 + Processing Score × 0.15
  let finalScore = (nutritionScore * 0.60) + (ingredientScore * 0.25) + (processingScore * 0.15);
  finalScore = Math.max(0, Math.min(100, Math.floor(finalScore)));

  let grade, gradeClass, ringClass;
  if (finalScore >= 75) {
    grade = "Good"; gradeClass = "badge-good"; ringClass = "score-good";
  }
  else if (finalScore >= 45) {
    grade = "Moderate"; gradeClass = "badge-average"; ringClass = "score-average";
  }
  else {
    grade = "Low"; gradeClass = "badge-poor"; ringClass = "score-poor";
  }

  // Construct findings lists
  nutritionPos.forEach(p => positiveFindings.push(p.name));
  ingredientPos.forEach(p => positiveFindings.push(p.name));
  nutritionNeg.forEach(n => negativeFindings.push(n.name));
  ingredientNeg.forEach(n => negativeFindings.push(n.name));
  processingNeg.forEach(n => negativeFindings.push(n.name));

  positiveFindings = [...new Set(positiveFindings.map(s => s.toLowerCase()))];
  negativeFindings = [...new Set(negativeFindings.map(s => s.toLowerCase()))];

  let descString = "A standard nutritional profile.";
  if (positiveFindings.length > 0 && negativeFindings.length > 0) {
    descString = `This product features ${positiveFindings.slice(0, 3).join(', ')}, but raises concerns with ${negativeFindings.slice(0, 3).join(', ')}.`;
  } else if (positiveFindings.length > 0) {
    descString = `This product is beneficial, featuring ${positiveFindings.slice(0, 3).join(', ')}.`;
  } else if (negativeFindings.length > 0) {
    descString = `This product is concerning due to ${negativeFindings.slice(0, 3).join(', ')}.`;
  }

  const breakdown = {
    positive: [...nutritionPos, ...ingredientPos],
    negative: [...nutritionNeg, ...ingredientNeg, ...processingNeg],
    nutritionScore,
    ingredientScore,
    processingScore,
    finalScore
  };

  return {
    name: raw.name || "Unknown Product",
    score: finalScore,
    grade,
    gradeClass,
    ringClass,
    desc: descString,
    nutrients: parsedNutrients,
    ingredients: topIngredients,
    recommendation: raw.ai_recommendation || "No recommendation provided.",
    positiveFindings,
    negativeFindings,
    breakdown
  };
}

// Clean LLM JSON format responses
function parseJsonResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error("Reasoning model returned an empty or invalid content payload.");
  }
  let cleaned = rawText.trim();

  // Extract strictly the JSON boundaries to bypass markdown or chat prefix/suffix
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned);
}

/* -------------------------------------------------------------
 * OFFLINE DEMO FALLBACK DATABASE & HASH GENERATOR
 * ------------------------------------------------------------- */
const mockProducts = {
  "oreo original": {
    name: "OREO ORIGINAL",
    score: 38,
    grade: "Poor",
    gradeClass: "badge-poor",
    ringClass: "score-poor",
    desc: "This product is high in processed sugar and low in nutritional value, posing risks if consumed regularly.",
    nutrients: {
      "Calories": "480 kcal",
      "Total Fat": "20 g",
      "Saturated Fat": "9 g",
      "Trans Fat": "0 g",
      "Cholesterol": "0 mg",
      "Sodium": "0.5 g",
      "Total Carbohydrates": "72 g",
      "Sugar": "38 g",
      "Added Sugar": "38 g",
      "Protein": "4.8 g",
      "Fiber": "2.0 g"
    },
    ingredients: [
      { name: "Added Sugar", risk: "High", riskClass: "badge-danger", desc: "38g per 100g represents a very high concentration. Contributes heavily to calorie density." },
      { name: "Palm Oil", risk: "Moderate", riskClass: "badge-warning", desc: "Saturated fat content is high. Regular consumption contributes to cardiovascular risks." },
      { name: "High Fructose Corn Syrup", risk: "High", riskClass: "badge-danger", desc: "Refined sweetener linked to metabolic issues when consumed frequently." }
    ],
    recommendation: "Oreo Original is a highly processed cookie with a low health score. It contains high amounts of added sugar and saturated fats from palm oil. It is not suitable for regular consumption and should be strictly limited for children. It should be treated as an occasional treat rather than a frequent snack."
  },
  "maggi masala noodles": {
    name: "MAGGI MASALA NOODLES",
    score: 42,
    grade: "Poor",
    gradeClass: "badge-poor",
    ringClass: "score-poor",
    desc: "This product has extremely high sodium content and contains highly refined wheat flour with minimal nutritional balance.",
    nutrients: {
      "Calories": "427 kcal",
      "Total Fat": "15.7 g",
      "Saturated Fat": "6.8 g",
      "Trans Fat": "0.1 g",
      "Cholesterol": "0 mg",
      "Sodium": "1.2 g",
      "Total Carbohydrates": "63.5 g",
      "Sugar": "2.2 g",
      "Protein": "8.0 g",
      "Fiber": "1.8 g"
    },
    ingredients: [
      { name: "High Sodium", risk: "High", riskClass: "badge-danger", desc: "1.2g of sodium per 100g is extremely high, consuming over 50% of daily recommended intake in one serving." },
      { name: "Palm Oil", risk: "Moderate", riskClass: "badge-warning", desc: "Used for frying noodles during pre-packaging, raising saturated fat content." },
      { name: "Refined Wheat Flour", risk: "Moderate", riskClass: "badge-warning", desc: "Processed flour stripped of natural dietary fiber and micronutrients." }
    ],
    recommendation: "Maggi Masala Noodles are highly processed and contain high levels of sodium and saturated fats. Regular consumption is not recommended, especially for growing children due to lack of essential nutrients and high sodium content. Limit to occasional consumption."
  },
  "parle-g": {
    name: "PARLE-G",
    score: 52,
    grade: "Average",
    gradeClass: "badge-average",
    ringClass: "score-average",
    desc: "This product provides quick carbohydrates but lacks protein and fiber, with moderate levels of added sugar.",
    nutrients: {
      "Calories": "454 kcal",
      "Total Fat": "13.3 g",
      "Saturated Fat": "6.2 g",
      "Cholesterol": "0 mg",
      "Sodium": "0.35 g",
      "Total Carbohydrates": "77 g",
      "Sugar": "26.3 g",
      "Protein": "6.5 g",
      "Fiber": "1.5 g"
    },
    ingredients: [
      { name: "Sugar", risk: "High", riskClass: "badge-danger", desc: "26.3g of added sugar is substantial. Offers empty calories with no nutritional offset." },
      { name: "Refined Wheat Flour", risk: "Moderate", riskClass: "badge-warning", desc: "Quickly digestible simple carbohydrates; can cause short-term blood sugar spikes." },
      { name: "Palm Oil", risk: "Moderate", riskClass: "badge-warning", desc: "Source of saturated fats, included for texture and extended shelf life." }
    ],
    recommendation: "Parle-G is a classic sweet biscuit. While it has a slightly lower fat content than some cream biscuits, it is still high in sugar and refined wheat flour (maida) with minimal fiber. It is average for health and should be consumed occasionally. For young children, limit portions as it contains significant added sugars."
  },
  "whole wheat bread": {
    name: "WHOLE WHEAT BREAD",
    score: 78,
    grade: "Good",
    gradeClass: "badge-good",
    ringClass: "score-good",
    desc: "A fiber-rich option with decent protein, making it a solid baseline for daily meals.",
    nutrients: {
      "Calories": "250 kcal",
      "Total Fat": "3.0 g",
      "Saturated Fat": "0.5 g",
      "Cholesterol": "0 mg",
      "Sodium": "0.45 g",
      "Total Carbohydrates": "46 g",
      "Sugar": "4.0 g",
      "Protein": "9.0 g",
      "Fiber": "6.0 g",
      "Calcium": "120 mg",
      "Iron": "2.4 mg"
    },
    ingredients: [
      { name: "Whole Wheat Flour", risk: "Neutral", riskClass: "badge-neutral", desc: "Rich in complex carbohydrates and natural bran fiber, aiding digestion." },
      { name: "Yeast", risk: "Neutral", riskClass: "badge-neutral", desc: "Standard leavening agent; natural source of some B vitamins." }
    ],
    recommendation: "This product scores high due to high dietary fiber and protein content. It is suitable for daily consumption for all age groups, including children. It offers slow-releasing energy and promotes good gut health."
  },
  "greek yogurt": {
    name: "GREEK YOGURT (UNSWEETENED)",
    score: 92,
    grade: "Excellent",
    gradeClass: "badge-excellent",
    ringClass: "score-excellent",
    desc: "An exceptional, protein-dense fermented dairy product with no added sugars and low sodium.",
    nutrients: {
      "Calories": "59 kcal",
      "Total Fat": "0.4 g",
      "Cholesterol": "5 mg",
      "Sodium": "0.04 g",
      "Total Carbohydrates": "3.6 g",
      "Sugar": "3.2 g",
      "Protein": "10.0 g",
      "Fiber": "0.0 g",
      "Calcium": "110 mg"
    },
    ingredients: [
      { name: "Skimmed Milk", risk: "Neutral", riskClass: "badge-neutral", desc: "High-protein, low-fat dairy base." },
      { name: "Active Yogurt Cultures", risk: "Neutral", riskClass: "badge-neutral", desc: "Probiotics that support intestinal health and nutrient absorption." }
    ],
    recommendation: "Greek Yogurt is an excellent source of high-quality protein and calcium with zero added sugar. It is highly suitable for children, teenagers, and adults of all age groups. It can be consumed daily as a healthy snack or breakfast base."
  }
};

function generateFallbackReportData(productName) {
  const normName = productName.trim().toLowerCase();

  let baseReport = null;
  for (let key in mockProducts) {
    if (normName.includes(key) || key.includes(normName)) {
      baseReport = mockProducts[key];
      break;
    }
  }

  if (baseReport) {
    // Deep clone base object to avoid mutating internal global database
    return JSON.parse(JSON.stringify(baseReport));
  }

  const hash = hashCode(normName);
  const score = 35 + (hash % 61);
  let grade = "", gradeClass = "", ringClass = "", desc = "", nutrients = {}, ingredients = [], recommendation = "";

  if (score >= 85) {
    grade = "Excellent"; gradeClass = "badge-excellent"; ringClass = "score-excellent";
    desc = "This product exhibits an outstanding nutritional profile, rich in essential dietary nutrients with zero adverse compounds.";
    nutrients = {
      "Calories": `${50 + (hash % 60)} kcal`,
      "Total Fat": `${(hash % 3) + 0.5} g`,
      "Saturated Fat": `${((hash % 2) / 2).toFixed(1)} g`,
      "Cholesterol": "0 mg",
      "Sodium": `${((hash % 10) / 100).toFixed(2)} g`,
      "Total Carbohydrates": `${10 + (hash % 15)} g`,
      "Sugar": `${(hash % 3) + 1.2} g`,
      "Protein": `${(8 + (hash % 8)).toFixed(1)} g`,
      "Fiber": `${(4 + (hash % 6)).toFixed(1)} g`,
      "Vitamin D": "2 mcg",
      "Calcium": "120 mg"
    };
    ingredients = [
      { name: "Organic Whole Grains", risk: "Neutral", riskClass: "badge-neutral", desc: "High in complex fibers supporting active digestive health." },
      { name: "Natural Plant Fibers", risk: "Neutral", riskClass: "badge-neutral", desc: "Helps stabilize blood sugar levels and promotes satiety." }
    ];
    recommendation = `${productName} is an clean product with an excellent health score of ${score}/100. It contains minimal added sweeteners or saturated fats. Highly suitable for daily consumption by all age groups, including growing children.`;
  } else if (score >= 70) {
    grade = "Good"; gradeClass = "badge-good"; ringClass = "score-good";
    desc = "This product offers a solid nutritional foundation, with a balanced ratio of macronutrients.";
    nutrients = {
      "Calories": `${120 + (hash % 100)} kcal`,
      "Total Fat": `${(2 + (hash % 6)).toFixed(1)} g`,
      "Saturated Fat": `${(1 + (hash % 2)).toFixed(1)} g`,
      "Cholesterol": "5 mg",
      "Sodium": `${(0.1 + (hash % 25) / 100).toFixed(2)} g`,
      "Total Carbohydrates": `${25 + (hash % 25)} g`,
      "Sugar": `${(3 + (hash % 8)).toFixed(1)} g`,
      "Protein": `${(4 + (hash % 6)).toFixed(1)} g`,
      "Fiber": `${(2 + (hash % 4)).toFixed(1)} g`
    };
    ingredients = [
      { name: "Wheat Bran Extract", risk: "Neutral", riskClass: "badge-neutral", desc: "Provides high fiber density and moderate mineral value." },
      { name: "Sunflower Oil", risk: "Moderate", riskClass: "badge-warning", desc: "Source of essential fatty acids; healthier fat choice but calorie dense." }
    ];
    recommendation = `${productName} provides a solid nutritional profile and receives a good score of ${score}/100. It is suitable for regular consumption by all age groups, representing a healthy school lunchbox option for children.`;
  } else if (score >= 50) {
    grade = "Average"; gradeClass = "badge-average"; ringClass = "score-average";
    desc = "This product is moderately processed. It contains simple sweeteners which should be monitored.";
    nutrients = {
      "Calories": `${250 + (hash % 150)} kcal`,
      "Total Fat": `${(6 + (hash % 10)).toFixed(1)} g`,
      "Saturated Fat": `${(2 + (hash % 4)).toFixed(1)} g`,
      "Cholesterol": "15 mg",
      "Sodium": `${(0.3 + (hash % 35) / 100).toFixed(2)} g`,
      "Total Carbohydrates": `${45 + (hash % 20)} g`,
      "Sugar": `${(10 + (hash % 14)).toFixed(1)} g`,
      "Protein": `${(2 + (hash % 5)).toFixed(1)} g`,
      "Fiber": `${(1 + (hash % 3)).toFixed(1)} g`
    };
    ingredients = [
      { name: "Refined Cane Sugar", risk: "Moderate", riskClass: "badge-warning", desc: "Simple sweetener. High glycemic response; limit total intake." },
      { name: "Bleached Flour (Maida)", risk: "Moderate", riskClass: "badge-warning", desc: "Processed flour lacking natural grain fibers." }
    ];
    recommendation = `${productName} ranks as average with a score of ${score}/100. It contains refined carbohydrates and moderate levels of added sugar. Consume in moderation. For children, limit portion sizes and treat as an occasional snack.`;
  } else {
    grade = "Poor"; gradeClass = "badge-poor"; ringClass = "score-poor";
    desc = "This product contains excessive sugars, saturated fats, or flavorings with very low nutrient density.";
    nutrients = {
      "Calories": `${360 + (hash % 200)} kcal`,
      "Total Fat": `${(12 + (hash % 16)).toFixed(1)} g`,
      "Saturated Fat": `${(5 + (hash % 8)).toFixed(1)} g`,
      "Trans Fat": `${((hash % 5) / 10).toFixed(1)} g`,
      "Cholesterol": "30 mg",
      "Sodium": `${(0.6 + (hash % 80) / 100).toFixed(2)} g`,
      "Total Carbohydrates": `${60 + (hash % 25)} g`,
      "Sugar": `${(24 + (hash % 24)).toFixed(1)} g`,
      "Protein": `${(1 + (hash % 4)).toFixed(1)} g`,
      "Fiber": `${(0 + (hash % 2)).toFixed(1)} g`
    };
    ingredients = [
      { name: "Palm Oil", risk: "Moderate", riskClass: "badge-warning", desc: "High in saturated fatty acids which contribute to arterial and cardiac strain." },
      { name: "High Fructose Corn Syrup", risk: "High", riskClass: "badge-danger", desc: "Refined sweetener linked to spikes in glucose and metabolic strain." }
    ];
    recommendation = `${productName} receives a low score of ${score}/100 due to intensive industrial processing. It is loaded with saturated fats and simple sugars. Not recommended for children, and should be restricted to rare consumption.`;
  }

  return {
    name: productName.toUpperCase(),
    score,
    grade,
    gradeClass,
    ringClass,
    desc,
    nutrients,
    ingredients,
    recommendation
  };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/* -------------------------------------------------------------
 * ANIMATION GRAPH ENGINE
 * ------------------------------------------------------------- */
function updateProgressRing(p) {
  const progressVal = Math.min(Math.max(p, 0), 1);
  const offset = 283 - (283 * progressVal);
  if (progressCircle) {
    progressCircle.style.strokeDashoffset = offset;
  }
}

function runProgressTick() {
  const diff = targetProgress - currentProgress;
  if (diff > 0.1) {
    // Eased animation progress towards the target threshold
    currentProgress += diff * 0.08;
  } else {
    currentProgress = targetProgress;
  }

  updateProgressRing(currentProgress / 100);

  if (currentProgress >= 100) {
    markStepDone(3);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // Render result screen directly without delay once 100% animation is complete
    renderResultScreen();
    return;
  }

  animationFrameId = requestAnimationFrame(runProgressTick);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function activateStep(idx) {
  const step = document.getElementById(`step-${idx}`);
  if (step) {
    step.classList.add('active');
    step.querySelector('.step-spinner').classList.remove('hidden');
  }
}

function markStepDone(idx) {
  const step = document.getElementById(`step-${idx}`);
  if (step) {
    step.classList.remove('active');
    step.classList.add('done');
    step.querySelector('.step-spinner').classList.add('hidden');
    step.querySelector('.step-check').classList.remove('hidden');
  }
}

/* -------------------------------------------------------------
 * ACTION PIPELINE
 * ------------------------------------------------------------- */
btnAnalyze.addEventListener('click', handleAnalysisPipeline);

async function handleAnalysisPipeline() {
  if (state.isAnalyzing) return;
  state.isAnalyzing = true;

  // Show the result screen (fixed full-viewport overlay — always starts at top)
  screenInput.classList.remove('active');
  analyzingState.classList.remove('hidden');
  resultContent.classList.add('hidden');
  screenResult.classList.add('active');

  // Scroll the overlay itself to top (in case user had previously scrolled results)
  screenResult.scrollTop = 0;

  // Reset loader visual steps
  document.querySelectorAll('.step-item').forEach((item, idx) => {
    item.classList.remove('active', 'done');
    const spinner = item.querySelector('.step-spinner');
    const check = item.querySelector('.step-check');
    if (idx === 0) spinner.classList.remove('hidden');
    else spinner.classList.add('hidden');
    check.classList.add('hidden');
  });

  // Setup visual starting parameters
  currentProgress = 0;
  targetProgress = 24.9; // creep to Step 0 end
  updateProgressRing(0);
  activateStep(0);

  // Trigger animation frame loops
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(runProgressTick);

  try {
    // Proactively load configurations
    await loadConfig();

    if (state.isDemoMode) {
      // OFFLINE MOCK MODE
      // Step 0: Read label (1.2s delay)
      await delay(1200);
      markStepDone(0);
      activateStep(1);
      targetProgress = 49.9;

      // Step 1: Extract ingredients (0.6s delay)
      await delay(600);
      markStepDone(1);
      activateStep(2);
      targetProgress = 74.9;

      // Step 2: Compute score (1.5s delay)
      await delay(1500);
      markStepDone(2);
      activateStep(3);
      targetProgress = 100;

      const report = generateFallbackReportData(state.productName);
      report.recommendation = `⚠️ API Key not configured in .env. Showing simulated food advisor report.\n\n${report.recommendation}`;
      state.currentReportData = report;

    } else {
      // LIVE AI MODE
      // Single API Call: Gemini reads the image and performs reasoning simultaneously
      const reasoningOutput = await runGeminiAnalysis(state.imageFile, state.productName);

      // Simulate completing all 3 progress stages smoothly
      markStepDone(0);
      activateStep(1);
      targetProgress = 49.9;
      await delay(300);

      markStepDone(1);
      activateStep(2);
      targetProgress = 74.9;
      await delay(300);

      markStepDone(2);
      activateStep(3);
      targetProgress = 100;

      // Parse the raw JSON extracted by Gemini
      const rawExtractedJson = parseJsonResponse(reasoningOutput);

      // Pass the raw text through the Deterministic JS engine for mapping, scoring, and formatting
      const report = processNutritionalData(rawExtractedJson);

      state.currentReportData = report;
    }
  } catch (error) {
    console.error("Analysis pipeline error:", error);

    // Recovery jump to completion
    markStepDone(0);
    markStepDone(1);
    markStepDone(2);
    activateStep(3);
    targetProgress = 100;

    // Build graceful fallback report
    const report = generateFallbackReportData(state.productName);
    report.recommendation = `⚠️ An error occurred during the live AI analysis (${error.message}). Displaying local fallback assessment.\n\n${report.recommendation}`;
    state.currentReportData = report;
  }
}

/* -------------------------------------------------------------
 * REPORT POPULATION AND RENDERING
 * ------------------------------------------------------------- */
function renderResultScreen() {
  state.isAnalyzing = false;
  const data = state.currentReportData;

  try {
    if (!data) {
      throw new Error("Missing nutrition report payload.");
    }

    // 1. PRODUCT HEADER
    resProductName.textContent = data.name || state.productName.toUpperCase() || 'PRODUCT REPORT';

    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    resDate.textContent = now.toLocaleDateString('en-US', options);

    // 2. OVERALL HEALTH SCORE
    resScore.textContent = data.score !== undefined ? data.score : 0;
    resGradeText.textContent = data.grade || 'Average';

    resGradeBadge.className = 'score-grade-badge';
    resGradeBadge.classList.add(data.gradeClass || 'badge-neutral');

    // SVG elements require setAttribute to reliably overwrite classes
    scoreCircleFill.setAttribute('class', `score-ring-fill ${data.ringClass || 'score-average'}`);

    // Set stroke dash offset (circumference = 326.7)
    const scoreVal = typeof data.score === 'number' ? data.score : parseFloat(data.score) || 0;
    const offset = 326.7 - (326.7 * Math.min(Math.max(scoreVal, 0), 100) / 100);
    scoreCircleFill.style.strokeDashoffset = offset;

    resAssessmentDesc.textContent = data.desc || '';

    // 3. DYNAMIC NUTRITION SUMMARY TABLE
    nutritionGrid.innerHTML = '';
    if (data.nutrients && typeof data.nutrients === 'object') {
      const wrapper = document.createElement('div');
      wrapper.className = 'nutri-table-wrapper';

      const table = document.createElement('table');
      table.className = 'nutri-table';

      table.innerHTML = `
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = table.querySelector('tbody');

      Object.entries(data.nutrients).forEach(([name, value]) => {
        const { iconHtml, iconClass } = getNutrientStyle(name);
        const valStr = value !== null && value !== undefined ? value.toString() : '';
        const valNum = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        const normName = name.toLowerCase();

        let statusText = "Normal";
        let statusClass = "badge-neutral";
        let rowStyle = "";

        if ((normName.includes('sugar') && valNum > 20) ||
          ((normName.includes('sodium') || normName.includes('salt')) && valNum > 0.5) ||
          ((normName.includes('fat') && !normName.includes('trans')) && valNum > 15)) {
          statusText = "High Limit";
          statusClass = "badge-poor";
          rowStyle = "background-color: rgba(239, 68, 68, 0.02);";
        } else if (normName.includes('fiber') && valNum > 3) {
          statusText = "Excellent";
          statusClass = "badge-excellent";
        } else if (normName.includes('protein') && valNum > 10) {
          statusText = "Excellent";
          statusClass = "badge-excellent";
        }

        const tr = document.createElement('tr');
        if (rowStyle) tr.setAttribute('style', rowStyle);

        tr.innerHTML = `
          <td>
            <div class="nutri-table-name-cell">
              <div class="nutri-icon ${iconClass}" style="width: 20px; height: 20px; min-width: 20px; min-height: 20px;">
                ${iconHtml}
              </div>
              <span>${name}</span>
            </div>
          </td>
          <td>
            <span class="nutri-table-value">${valStr || 'N/A'}</span>
          </td>
          <td>
            <span class="nutri-table-status-badge ${statusClass}">${statusText}</span>
          </td>
        `;
        tbody.appendChild(tr);
      });

      wrapper.appendChild(table);
      nutritionGrid.appendChild(wrapper);
    }

    // 4. INGREDIENT INSIGHTS
    resIngredientsList.innerHTML = '';
    if (Array.isArray(data.ingredients)) {
      data.ingredients.forEach(ing => {
        const card = document.createElement('div');
        card.className = 'ingredient-insight-card';
        card.innerHTML = `
          <div class="ingredient-title-row">
            <span class="ingredient-name">${ing.name || 'Unknown Ingredient'}</span>
            <span class="insight-badge ${ing.riskClass || 'badge-neutral'}">${ing.risk || 'Neutral'} Risk</span>
          </div>
          <p class="ingredient-desc">${ing.desc || ''}</p>
        `;
        resIngredientsList.appendChild(card);
      });
    }

    // 5. AI RECOMMENDATION
    resRecommendation.textContent = data.recommendation || 'No advisory recommendation details extracted.';

  } catch (err) {
    console.error("Critical rendering error:", err);
    resRecommendation.textContent = `⚠️ A rendering error occurred while composing the report: ${err.message}.`;
  } finally {
    // Reveal screen and hide loader - finally block guarantees recovery from freezes
    analyzingState.classList.add('hidden');
    resultContent.classList.remove('hidden');
  }
}

/* -------------------------------------------------------------
 * NAVIGATION BACK
 * ------------------------------------------------------------- */
btnBackToScan.addEventListener('click', () => {
  inputProductName.value = '';
  resetUploadState();

  state.isAnalyzing = false;
  state.currentReportData = null;

  screenResult.classList.remove('active');
  screenResult.scrollTop = 0;
  screenInput.classList.add('active');
});

/* -------------------------------------------------------------
 * DOWNLOAD SIMULATION: PDF AND DOCX
 * ------------------------------------------------------------- */
btnDownloadPdf.addEventListener('click', () => {
  window.print();
});

btnDownloadDocx.addEventListener('click', () => {
  if (!state.currentReportData) return;

  const data = state.currentReportData;
  const fileName = `${data.name.replace(/\s+/g, '_')}_Health_Report.doc`;

  const wordDocumentHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <title>NutriScan AI Health Report - ${data.name}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 40px; }
        .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 26px; font-weight: bold; color: #0f172a; margin: 0 0 5px 0; text-transform: uppercase; }
        .subtitle { font-size: 14px; color: #64748b; margin: 0; }
        .section-header { font-size: 18px; font-weight: bold; color: #10b981; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; }
        .score-container { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .score-value { font-size: 36px; font-weight: 800; color: #0f172a; }
        .score-grade { font-size: 16px; font-weight: 700; color: #10b981; margin-top: 5px; }
        .nutrition-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .nutrition-table th, .nutrition-table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        .nutrition-table th { background-color: #f1f5f9; font-weight: 600; }
        .ingredient-item { background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 15px; margin-bottom: 10px; }
        .ingredient-title { font-weight: bold; font-size: 15px; }
        .recommendation-box { background-color: #ecfdf5; border: 1px dashed #10b981; padding: 20px; border-radius: 8px; }
        .footer-note { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${data.name}</h1>
        <p class="subtitle">NutriScan AI Food Health Analysis Report</p>
        <p class="subtitle">Generated on: ${resDate.textContent}</p>
      </div>
      
      <div class="score-container">
        <div>Health Score Assessment</div>
        <div class="score-value">${data.score} / 100</div>
        <div class="score-grade">${data.grade} Rating</div>
        <p style="margin: 10px 0 0 0; color: #475569; font-size: 13px;">${data.desc}</p>
      </div>

      <div class="section-header">Nutrition Summary (per 100g)</div>
      <table class="nutrition-table">
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${data.nutrients ? Object.entries(data.nutrients).map(([key, val]) => `
            <tr><td><strong>${key}</strong></td><td>${val || 'N/A'}</td></tr>
          `).join('') : ''}
        </tbody>
      </table>

      <div class="section-header">Ingredient Analysis Insights</div>
      <div>
        ${Array.isArray(data.ingredients) ? data.ingredients.map(ing => `
          <div class="ingredient-item" style="border-left-color: ${ing.risk === 'High' ? '#ef4444' : ing.risk === 'Moderate' ? '#f59e0b' : '#94a3b8'}">
            <span class="ingredient-title">${ing.name || 'Unknown Ingredient'}</span> - 
            <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${ing.risk === 'High' ? '#ef4444' : ing.risk === 'Moderate' ? '#b45309' : '#475569'}">${ing.risk || 'Neutral'} Risk</span>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">${ing.desc || ''}</p>
          </div>
        `).join('') : ''}
      </div>

      <div class="section-header">AI Nutrition Advisor Recommendation</div>
      <div class="recommendation-box">
        <p style="margin: 0; font-weight: 500;">${data.recommendation || ''}</p>
      </div>

      <div class="footer-note">
        Disclaimer: This report was synthesized by NutriScan AI based on the nutritional ingredients declared on the product label. It is intended for general informational purposes and does not replace medical advice.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordDocumentHTML], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
});