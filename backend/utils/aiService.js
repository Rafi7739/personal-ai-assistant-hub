const axios = require('axios');

const callGemini = async (message, category, apiKey, history = []) => {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('Gemini API key নেই');

    const contents = [];
    history.slice(-10).forEach(msg => {
        contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        });
    });
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Empty response');
};

const callGPT = async (message, category, apiKey, history = []) => {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OpenAI API key নেই');
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: message }], max_tokens: 2048 },
        { headers: { 'Authorization': `Bearer ${key}` }, timeout: 30000 }
    );
    return response.data.choices[0].message.content;
};

const callClaude = async (message, category, apiKey, history = []) => {
    const key = apiKey || process.env.CLAUDE_API_KEY;
    if (!key) throw new Error('Claude API key নেই');
    const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        { model: 'claude-3-haiku-20240307', max_tokens: 2048, messages: [{ role: 'user', content: message }] },
        { headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' }, timeout: 30000 }
    );
    return response.data.content[0].text;
};

const generateAIResponse = async (message, category, model, apiKeys = {}, history = []) => {
    switch (model) {
        case 'gemini': return await callGemini(message, category, apiKeys.gemini, history);
        case 'gpt': return await callGPT(message, category, apiKeys.openai, history);
        case 'claude': return await callClaude(message, category, apiKeys.claude, history);
        default: return generateBuiltInResponse(message, category);
    }
};

const generateBuiltInResponse = (message, category) => {
    return `🤖 **Built-in AI**\n\nYou asked: "${message}"\n\nReal AI পেতে Settings এ Gemini API key দাও (ফ্রি):\n👉 https://aistudio.google.com/app/apikey`;
};

module.exports = { generateAIResponse, generateBuiltInResponse };