const fs = require('fs');
const path = require('path');

// Basic .env parser
function getEnvKey(key) {
    try {
        const envPath = path.join(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(new RegExp(`${key}=(.*)`));
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const API_KEY = getEnvKey('VITE_GEMINI_API_KEY');

async function listModels(version = 'v1') {
    console.log(`\n--- Listing models for ${version} ---`);
    try {
        const url = `https://generativelanguage.googleapis.com/${version}/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error(`Error (${version}):`, data.error.message);
            return;
        }

        if (data.models) {
            console.log(`Found ${data.models.length} models for ${version}.`);
            data.models.forEach(m => {
                if (m.name.includes('flash')) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log(`No models found for ${version}.`);
        }
    } catch (error) {
        console.error(`Fetch failed for ${version}:`, error.message);
    }
}

async function runDiagnostics() {
    if (!API_KEY) {
        console.error("Missing VITE_GEMINI_API_KEY in .env");
        return;
    }
    console.log(`Using API Key starting with: ${API_KEY.substring(0, 5)}...`);
    await listModels('v1');
    await listModels('v1beta');
}

runDiagnostics();
