const API_KEY = 'AIzaSyASZN7khEhiY9DC7Iu7faoLuCB5wf6Ovz4';
const MODEL_NAME = 'gemini-2.0-flash';

async function testGemini() {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    // High Compatibility Payload - Prepend system instructions
    const systemInstruction = "You are a helpful assistant.";
    const userMessage = "Hello, are you working?";

    const payload = {
        contents: [{
            role: 'user',
            parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemInstruction}\n\nUSER MESSAGE:\n${userMessage}` }]
        }],
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
        }
    };

    console.log(`Testing Model: ${MODEL_NAME}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error Status:', response.status);
            console.error('Error Details:', JSON.stringify(error, null, 2));
        } else {
            const data = await response.json();
            console.log('Success!');
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

testGemini();
