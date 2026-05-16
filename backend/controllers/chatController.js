const Chat = require('../models/Chat');
const User = require('../models/User');

// ===== BUILT-IN AI ENGINE =====
const generateAIResponse = (message, category, model) => {
    const lowerMsg = message.toLowerCase();

    // ---- GREETING ----
    if (lowerMsg.match(/^(hello|hi|hey|assalamu|salam|howdy|good morning|good evening)/)) {
        return `👋 **Hello there!**\n\nWelcome to your **Personal AI Assistant Hub**! I'm currently running on the **${model.toUpperCase()}** engine.\n\nI can help you with:\n\n| Category | Description |\n|----------|-------------|\n| 💬 General | Ask me anything |\n| 💻 Coding | Write & debug code |\n| ✍️ Writing | Emails, essays, letters |\n| 🔢 Math | Calculations & formulas |\n| 🎨 Creative | Stories, poems & ideas |\n| 📊 Analysis | Summarize & analyze |\n| 🖼️ Images | Generate image descriptions |\n\n> **Tip:** You can switch between AI models using the dropdown above!\n\nWhat would you like to do today? 🚀`;
    }

    // ---- CODING ----
    if (lowerMsg.includes('javascript') || lowerMsg.includes('code') || lowerMsg.includes('function') || lowerMsg.includes('program') || lowerMsg.includes('react') || lowerMsg.includes('node') || lowerMsg.includes('python') || lowerMsg.includes('html') || lowerMsg.includes('css') || category === 'coding') {

        if (lowerMsg.includes('react')) {
            return `⚛️ **React Component Example**\n\n\`\`\`jsx\nimport React, { useState, useEffect } from 'react';\n\nconst App = () => {\n    const [data, setData] = useState([]);\n    const [loading, setLoading] = useState(true);\n    const [error, setError] = useState(null);\n\n    useEffect(() => {\n        fetchData();\n    }, []);\n\n    const fetchData = async () => {\n        try {\n            const response = await fetch('/api/data');\n            const result = await response.json();\n            setData(result);\n        } catch (err) {\n            setError(err.message);\n        } finally {\n            setLoading(false);\n        }\n    };\n\n    if (loading) return <div className="spinner">Loading...</div>;\n    if (error) return <div className="error">Error: {error}</div>;\n\n    return (\n        <div className="app">\n            <h1>📊 Data Dashboard</h1>\n            <div className="grid">\n                {data.map((item, index) => (\n                    <div key={index} className="card">\n                        <h3>{item.title}</h3>\n                        <p>{item.description}</p>\n                    </div>\n                ))}\n            </div>\n        </div>\n    );\n};\n\nexport default App;\n\`\`\`\n\n**Key Concepts Used:**\n- ✅ \`useState\` for state management\n- ✅ \`useEffect\` for side effects\n- ✅ Async/await for API calls\n- ✅ Loading & error states\n- ✅ Conditional rendering\n\n> Need more React help? Just ask! 🚀`;
        }

        if (lowerMsg.includes('python')) {
            return `🐍 **Python Code Example**\n\n\`\`\`python\n# Python Advanced Example\nimport json\nfrom datetime import datetime\nfrom typing import List, Dict, Optional\n\nclass DataProcessor:\n    \"\"\"A class to process and analyze data.\"\"\"\n    \n    def __init__(self, name: str):\n        self.name = name\n        self.data: List[Dict] = []\n        self.created_at = datetime.now()\n    \n    def add_item(self, item: Dict) -> None:\n        \"\"\"Add an item to the dataset.\"\"\"\n        item['timestamp'] = datetime.now().isoformat()\n        self.data.append(item)\n        print(f\"✅ Added: {item}\")\n    \n    def filter_data(self, key: str, value: any) -> List[Dict]:\n        \"\"\"Filter data by key-value pair.\"\"\"\n        return [item for item in self.data if item.get(key) == value]\n    \n    def get_summary(self) -> Dict:\n        \"\"\"Get a summary of the dataset.\"\"\"\n        return {\n            'name': self.name,\n            'total_items': len(self.data),\n            'created_at': self.created_at.isoformat(),\n            'keys': list(set(k for item in self.data for k in item.keys()))\n        }\n    \n    def export_json(self, filename: str) -> None:\n        \"\"\"Export data to JSON file.\"\"\"\n        with open(filename, 'w') as f:\n            json.dump(self.data, f, indent=2)\n        print(f\"📁 Exported to {filename}\")\n\n# Usage\nif __name__ == '__main__':\n    processor = DataProcessor('My Dataset')\n    processor.add_item({'name': 'Alice', 'age': 30, 'city': 'NYC'})\n    processor.add_item({'name': 'Bob', 'age': 25, 'city': 'LA'})\n    print(processor.get_summary())\n\`\`\`\n\n**Features:**\n- Type hints for better code quality\n- Class-based architecture\n- JSON export functionality\n- Data filtering and summarization`;
        }

        if (lowerMsg.includes('api') || lowerMsg.includes('express') || lowerMsg.includes('node')) {
            return `🚀 **Node.js Express API Example**\n\n\`\`\`javascript\nconst express = require('express');\nconst mongoose = require('mongoose');\nconst cors = require('cors');\n\nconst app = express();\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// MongoDB Schema\nconst ItemSchema = new mongoose.Schema({\n    title: { type: String, required: true },\n    description: String,\n    status: { type: String, enum: ['active', 'inactive'], default: 'active' },\n    createdAt: { type: Date, default: Date.now }\n});\n\nconst Item = mongoose.model('Item', ItemSchema);\n\n// Routes\n// GET all items\napp.get('/api/items', async (req, res) => {\n    try {\n        const items = await Item.find().sort({ createdAt: -1 });\n        res.json({ success: true, count: items.length, data: items });\n    } catch (err) {\n        res.status(500).json({ success: false, error: err.message });\n    }\n});\n\n// POST new item\napp.post('/api/items', async (req, res) => {\n    try {\n        const item = await Item.create(req.body);\n        res.status(201).json({ success: true, data: item });\n    } catch (err) {\n        res.status(400).json({ success: false, error: err.message });\n    }\n});\n\n// PUT update item\napp.put('/api/items/:id', async (req, res) => {\n    try {\n        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });\n        res.json({ success: true, data: item });\n    } catch (err) {\n        res.status(400).json({ success: false, error: err.message });\n    }\n});\n\n// DELETE item\napp.delete('/api/items/:id', async (req, res) => {\n    try {\n        await Item.findByIdAndDelete(req.params.id);\n        res.json({ success: true, message: 'Item deleted' });\n    } catch (err) {\n        res.status(500).json({ success: false, error: err.message });\n    }\n});\n\n// Connect & Start\nmongoose.connect('mongodb://localhost:27017/myapp')\n    .then(() => {\n        app.listen(3000, () => console.log('🚀 Server on port 3000'));\n    });\n\`\`\`\n\n**API Endpoints:**\n| Method | Route | Description |\n|--------|-------|-------------|\n| GET | /api/items | Get all items |\n| POST | /api/items | Create item |\n| PUT | /api/items/:id | Update item |\n| DELETE | /api/items/:id | Delete item |`;
        }

        if (lowerMsg.includes('html') || lowerMsg.includes('css')) {
            return `🎨 **HTML & CSS Example**\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Modern Card Layout</title>\n    <style>\n        * { margin: 0; padding: 0; box-sizing: border-box; }\n        \n        body {\n            font-family: 'Segoe UI', sans-serif;\n            background: linear-gradient(135deg, #0a0a1a, #1a1a3e);\n            min-height: 100vh;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            padding: 20px;\n        }\n        \n        .container {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n            gap: 20px;\n            max-width: 1200px;\n            width: 100%;\n        }\n        \n        .card {\n            background: rgba(255, 255, 255, 0.05);\n            backdrop-filter: blur(10px);\n            border: 1px solid rgba(255, 255, 255, 0.1);\n            border-radius: 16px;\n            padding: 30px;\n            transition: transform 0.3s, box-shadow 0.3s;\n        }\n        \n        .card:hover {\n            transform: translateY(-8px);\n            box-shadow: 0 20px 40px rgba(108, 99, 255, 0.2);\n        }\n        \n        .card h3 {\n            color: #fff;\n            margin-bottom: 10px;\n            font-size: 1.3rem;\n        }\n        \n        .card p {\n            color: rgba(255, 255, 255, 0.7);\n            line-height: 1.6;\n        }\n        \n        .card .btn {\n            display: inline-block;\n            margin-top: 15px;\n            padding: 10px 24px;\n            background: linear-gradient(135deg, #6C63FF, #5A52E0);\n            color: #fff;\n            border: none;\n            border-radius: 10px;\n            cursor: pointer;\n            font-weight: 600;\n            transition: 0.3s;\n        }\n        \n        .card .btn:hover {\n            box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);\n        }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <div class="card">\n            <h3>🚀 Feature One</h3>\n            <p>Modern glassmorphism card with smooth hover effects.</p>\n            <button class="btn">Learn More</button>\n        </div>\n        <div class="card">\n            <h3>⚡ Feature Two</h3>\n            <p>Responsive grid layout that works on all screen sizes.</p>\n            <button class="btn">Explore</button>\n        </div>\n        <div class="card">\n            <h3>🎨 Feature Three</h3>\n            <p>Beautiful gradient backgrounds with CSS animations.</p>\n            <button class="btn">Get Started</button>\n        </div>\n    </div>\n</body>\n</html>\n\`\`\`\n\n**CSS Techniques Used:**\n- ✅ CSS Grid with auto-fit\n- ✅ Glassmorphism effect\n- ✅ Gradient backgrounds\n- ✅ Smooth hover transitions\n- ✅ Responsive design`;
        }

        return `💻 **Coding Assistant** [${model.toUpperCase()}]\n\nI can help you with programming! Here's what I know:\n\n### Languages & Frameworks:\n| Language | Frameworks |\n|----------|------------|\n| JavaScript | React, Node.js, Express, Vue |\n| Python | Django, Flask, FastAPI |\n| HTML/CSS | Tailwind, Bootstrap, SASS |\n| TypeScript | Next.js, Angular |\n| SQL | PostgreSQL, MySQL, MongoDB |\n\n### Ask me about:\n- 📝 Code examples & templates\n- 🐛 Debugging help\n- 📐 Algorithm design\n- 🏗️ Architecture patterns\n- 🔧 Best practices\n- 📚 Learning resources\n\n\`\`\`javascript\n// Quick tip: Always handle errors!\ntry {\n    const result = await someAsyncOperation();\n    console.log(result);\n} catch (error) {\n    console.error('Something went wrong:', error);\n}\n\`\`\`\n\nWhat would you like to code? 🚀`;
    }

    // ---- MATH ----
    if (lowerMsg.includes('calculate') || lowerMsg.includes('math') || lowerMsg.match(/\d+\s*[+\-*/^%]\s*\d+/) || category === 'math') {
        try {
            const mathMatch = lowerMsg.match(/(\d+\.?\d*)\s*([+\-*/^%])\s*(\d+\.?\d*)/);
            if (mathMatch) {
                const [, a, op, b] = mathMatch;
                const num1 = parseFloat(a);
                const num2 = parseFloat(b);
                let result, operation;
                switch(op) {
                    case '+': result = num1 + num2; operation = 'Addition'; break;
                    case '-': result = num1 - num2; operation = 'Subtraction'; break;
                    case '*': result = num1 * num2; operation = 'Multiplication'; break;
                    case '/': result = num2 !== 0 ? (num1 / num2).toFixed(4) : 'Cannot divide by zero ❌'; operation = 'Division'; break;
                    case '^': result = Math.pow(num1, num2); operation = 'Power'; break;
                    case '%': result = num1 % num2; operation = 'Modulo'; break;
                }
                return `🔢 **${operation} Result**\n\n| Expression | Result |\n|-----------|--------|\n| ${num1} ${op} ${num2} | **${result}** |\n\n### Additional Info:\n- Square root of ${num1}: **${Math.sqrt(num1).toFixed(4)}**\n- Square root of ${num2}: **${Math.sqrt(num2).toFixed(4)}**\n- ${num1} squared: **${Math.pow(num1, 2)}**\n- ${num2} squared: **${Math.pow(num2, 2)}**\n\n> Need more calculations? Just type them! 🧮`;
            }
        } catch(e) {}
        return `🔢 **Math Helper**\n\nI can solve:\n\n| Type | Example |\n|------|--------|\n| Addition | \`25 + 17\` |\n| Subtraction | \`100 - 37\` |\n| Multiplication | \`12 * 8\` |\n| Division | \`144 / 12\` |\n| Power | \`2 ^ 10\` |\n| Modulo | \`17 % 5\` |\n\n**Formulas I know:**\n- Area of circle: π × r²\n- Pythagorean theorem: a² + b² = c²\n- Quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n\nType a calculation like \`245 * 18\` and I'll solve it! 🧮`;
    }

    // ---- WRITING ----
    if (lowerMsg.includes('write') || lowerMsg.includes('email') || lowerMsg.includes('letter') || lowerMsg.includes('essay') || category === 'writing') {
        if (lowerMsg.includes('email')) {
            return `📧 **Professional Email Draft**\n\n---\n\n**Subject:** ${message.replace(/write|email|me|a|an|please/gi, '').trim() || 'Follow-up on Our Recent Discussion'}\n\n---\n\nDear [Recipient Name],\n\nI hope this email finds you well. I am writing to follow up on our recent conversation regarding the above matter.\n\nI wanted to take this opportunity to:\n\n1. **Summarize** the key points we discussed\n2. **Confirm** the next steps we agreed upon\n3. **Propose** a timeline for implementation\n\nPlease find the relevant details below:\n\n> *[Insert specific details here]*\n\nI would greatly appreciate your feedback at your earliest convenience. If you have any questions or require further clarification, please don't hesitate to reach out.\n\nLooking forward to hearing from you.\n\nBest regards,\n**[Your Name]**\n[Your Title]\n[Your Company]\n📞 [Phone] | ✉️ [Email]\n\n---\n\n*💡 Tip: Customize the bracketed sections with your specific details!*`;
        }
        return `✍️ **Writing Assistant** [${model.toUpperCase()}]\n\nI can help you write:\n\n| Type | Description |\n|------|-------------|\n| 📧 Email | Professional, casual, or formal |\n| 📝 Essay | Academic, persuasive, narrative |\n| 💌 Letter | Cover letter, thank you, complaint |\n| 📄 Report | Business, technical, research |\n| 📋 Resume | Professional CV sections |\n| 📢 Social Media | Posts, captions, threads |\n\n**Writing Tips:**\n\n1. ✅ Start with a clear purpose\n2. ✅ Know your audience\n3. ✅ Use active voice\n4. ✅ Keep paragraphs short\n5. ✅ Proofread before sending\n\n> Tell me what you'd like to write and I'll create a draft! ✨`;
    }

    // ---- CREATIVE ----
    if (lowerMsg.includes('story') || lowerMsg.includes('poem') || lowerMsg.includes('creative') || lowerMsg.includes('joke') || category === 'creative') {
        if (lowerMsg.includes('joke')) {
            const jokes = [
                `😄 **Here's a programming joke:**\n\n> Why do programmers prefer dark mode?\n> \n> Because **light attracts bugs!** 🐛\n\n---\n\n> What's a programmer's favorite hangout place?\n> \n> **Foo Bar!** 🍺`,
                `😄 **Tech Joke:**\n\n> A SQL query walks into a bar, sees two tables and asks:\n> \n> "Can I **JOIN** you?" 🎭\n\n---\n\n> Why was the JavaScript developer sad?\n> \n> Because he didn't **Node** how to **Express** himself! 😂`,
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        if (lowerMsg.includes('poem')) {
            return `🎭 **A Poem for You**\n\n---\n\n### Digital Dreams\n\n*In circuits deep where data flows,*\n*A digital garden softly grows,*\n*Where algorithms dance and play,*\n*Creating worlds both night and day.*\n\n*The code compiles without a flaw,*\n*Each function answering nature's law,*\n*In binary whispers, soft and light,*\n*The future gleams forever bright.*\n\n*So here we stand at dawn's new gate,*\n*Where human dreams and machines create,*\n*A partnership of heart and mind,*\n*The best of both, forever entwined.* ✨\n\n---\n\n*— Generated by AI Assistant Hub*\n\nWant me to write a poem on a specific topic? 📝`;
        }

        return `🎨 **Creative Corner** [${model.toUpperCase()}]\n\nI can create:\n\n- 📖 **Short Stories** - Any genre\n- 🎭 **Poetry** - Various styles\n- 😄 **Jokes** - Clean humor\n- 💡 **Ideas** - Brainstorming\n- 🎬 **Scripts** - Dialogue writing\n- 🎵 **Lyrics** - Song writing\n- 🎮 **Game Ideas** - Concepts\n\n> Say something like "write me a poem about coding" or "tell me a joke"! 🌟`;
    }

    // ---- ANALYSIS ----
    if (lowerMsg.includes('analyze') || lowerMsg.includes('analysis') || lowerMsg.includes('summarize') || lowerMsg.includes('explain') || category === 'analysis') {
        return `📊 **Analysis Assistant** [${model.toUpperCase()}]\n\nI can analyze:\n\n### Text Analysis\n- 📝 Summarize long documents\n- 😊 Sentiment/mood detection\n- 🔑 Key point extraction\n- 📊 Readability score\n\n### Data Analysis\n- 📈 Trend identification\n- 📉 Pattern recognition\n- 🎯 Statistical insights\n\n### How to use:\n1. Paste your text below\n2. Tell me what kind of analysis you need\n3. I'll provide detailed results\n\n> **Example:** "Analyze the mood of: I had a wonderful day at the park with my family"\n\nWhat would you like me to analyze? 🔍`;
    }

    // ---- IMAGE ----
    if (lowerMsg.includes('image') || lowerMsg.includes('picture') || lowerMsg.includes('draw') || lowerMsg.includes('generate image') || category === 'image') {
        return `🖼️ **Image Generation**\n\nI can describe images for you! While direct image generation requires API keys (DALL-E/Stable Diffusion), here's what I can do:\n\n### 🎨 Image Description:\n**Prompt:** "${message.replace(/generate|image|picture|draw|create|make/gi, '').trim() || 'a beautiful sunset'}"\n\n**Visual Description:**\n> Imagine a stunning digital artwork featuring vibrant colors and intricate details. The composition follows the rule of thirds with a strong focal point in the center. Rich gradients flow from warm oranges and purples to cool blues, creating a sense of depth and atmosphere. Fine details add texture throughout, with delicate particles floating in the air catching ethereal light.\n\n### To enable actual image generation:\n1. Get an API key from [OpenAI DALL-E](https://platform.openai.com)\n2. Add it to Settings → API Configuration\n3. Select "GPT" model\n\n> The image generation feature will create actual images once configured! 🖼️`;
    }

    // ---- HELP ----
    if (lowerMsg.includes('help') || lowerMsg.includes('what can you do') || lowerMsg.includes('features')) {
        return `🆘 **Complete Feature Guide**\n\n### 🤖 AI Chat\n- Multi-model support (Built-in, GPT, Gemini, Claude)\n- Category-based conversations\n- Chat history & bookmarks\n\n### 🛠️ AI Tools\n| Tool | Description |\n|------|-------------|\n| 📝 Summarizer | Condense long texts |\n| 💻 Code Gen | Generate code snippets |\n| 🌐 Translator | Multi-language translation |\n| 📧 Email Writer | Professional emails |\n| ✅ Grammar | Check & fix grammar |\n| 😊 Mood | Analyze text sentiment |\n| 🍳 Recipe | Generate recipes |\n| 📝 Quiz | Create quizzes |\n| 🖼️ Image | Generate images |\n\n### 🎤 Voice Input\n- Click the 🎤 microphone button\n- Speak your message\n- It auto-converts to text!\n\n### 📄 Export\n- Export any chat as PDF\n- Save conversations offline\n\n### ⚙️ Settings\n- Dark/Light theme\n- Default AI model\n- Profile management\n\n> **Keyboard Shortcuts:**\n> - \`Enter\` → Send message\n> - \`Shift+Enter\` → New line\n> - \`Ctrl+/\` → Focus chat input`;
    }

    // ---- DEFAULT ----
    const defaults = [
        `🤖 **AI Assistant** [${model.toUpperCase()}]\n\nYou said: *"${message}"*\n\nThat's an interesting topic! Here are my thoughts:\n\n### Key Points:\n1. **Understanding** - This is a topic worth exploring in depth\n2. **Applications** - There are many practical applications\n3. **Learning** - I recommend starting with the fundamentals\n\n### Resources:\n- 📚 Online courses and tutorials\n- 📖 Books and documentation\n- 👥 Community forums and discussions\n\n### Quick Tips:\n> - Break complex problems into smaller parts\n> - Practice regularly for better understanding\n> - Don't hesitate to ask follow-up questions!\n\nWould you like me to go deeper into any specific aspect? 🎯`,

        `💡 **Here's what I think** [${model.toUpperCase()}]\n\nRegarding: *"${message}"*\n\n---\n\nThis is a great question! Let me break it down:\n\n### Analysis:\n- **Context:** This topic has multiple dimensions worth exploring\n- **Key factors:** Several important aspects to consider\n- **Recommendation:** Start with the basics and build up\n\n### What I can help with:\n| Action | Command |\n|--------|---------|\n| Get code help | Ask about any language |\n| Write content | "Write me an email about..." |\n| Do math | "Calculate 125 * 47" |\n| Be creative | "Write a poem about..." |\n| Analyze text | "Analyze the mood of..." |\n\n> 💡 **Pro tip:** Use the AI Tools in the sidebar for specialized tasks!\n\nWhat else would you like to know? ✨`
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
};

// ===== CONTROLLERS =====
exports.createChat = async (req, res) => {
    try {
        const { message, category, model: chatModel, isVoiceInput } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Please provide a message' });
        }

        const selectedModel = chatModel || req.user.preferences.defaultModel || 'built-in';
        const aiResponse = generateAIResponse(message, category || 'general', selectedModel);
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;

        const chat = await Chat.create({
            user: req.user._id,
            title,
            category: category || 'general',
            model: selectedModel,
            messages: [
                { role: 'user', content: message, model: selectedModel, isVoiceInput: isVoiceInput || false },
                { role: 'assistant', content: aiResponse, model: selectedModel }
            ]
        });

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'apiUsage.totalRequests': 1 },
            'apiUsage.lastRequest': new Date()
        });

        res.status(201).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { message, isVoiceInput } = req.body;
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });

        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        const aiResponse = generateAIResponse(message, chat.category, chat.model);

        chat.messages.push(
            { role: 'user', content: message, model: chat.model, isVoiceInput: isVoiceInput || false },
            { role: 'assistant', content: aiResponse, model: chat.model }
        );

        await chat.save();

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'apiUsage.totalRequests': 1 },
            'apiUsage.lastRequest': new Date()
        });

        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChats = async (req, res) => {
    try {
        const { category, bookmarked, pinned, search, page = 1, limit = 30 } = req.query;
        const query = { user: req.user._id, isArchived: false };

        if (category) query.category = category;
        if (bookmarked === 'true') query.isBookmarked = true;
        if (pinned === 'true') query.isPinned = true;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'messages.content': { $regex: search, $options: 'i' } }
            ];
        }

        const chats = await Chat.find(query)
            .sort({ isPinned: -1, updatedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('title category isBookmarked isPinned model updatedAt messages');

        const total = await Chat.countDocuments(query);

        const chatsWithPreview = chats.map(chat => ({
            ...chat.toObject(),
            lastMessage: chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].content.substring(0, 100)
                : '',
            messageCount: chat.messages.length
        }));

        res.status(200).json({
            success: true,
            count: chats.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            chats: chatsWithPreview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateChat = async (req, res) => {
    try {
        const { title, category, isPinned } = req.body;
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        if (title !== undefined) chat.title = title;
        if (category !== undefined) chat.category = category;
        if (isPinned !== undefined) chat.isPinned = isPinned;

        await chat.save();
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleBookmark = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        chat.isBookmarked = !chat.isBookmarked;
        await chat.save();
        res.status(200).json({ success: true, isBookmarked: chat.isBookmarked });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.togglePin = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        chat.isPinned = !chat.isPinned;
        await chat.save();
        res.status(200).json({ success: true, isPinned: chat.isPinned });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, message: 'Chat deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.exportChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        let htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.8; }
                h1 { color: #6C63FF; border-bottom: 3px solid #6C63FF; padding-bottom: 15px; font-size: 24px; }
                .meta { color: #666; font-size: 13px; margin-bottom: 30px; padding: 10px; background: #f5f5f5; border-radius: 8px; }
                .message { margin: 15px 0; padding: 18px; border-radius: 12px; }
                .user { background: #6C63FF; color: white; margin-left: 40px; }
                .assistant { background: #f0f2f8; color: #1a1a2e; margin-right: 40px; border: 1px solid #e0e0e0; }
                .role { font-weight: bold; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
                .content { font-size: 14px; white-space: pre-wrap; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; color: #999; font-size: 12px; text-align: center; }
                code { background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
                pre { background: #1a1a2e; color: #fff; padding: 15px; border-radius: 8px; overflow-x: auto; }
                pre code { background: none; color: #fff; }
            </style>
        </head>
        <body>
            <h1>🤖 ${chat.title}</h1>
            <div class="meta">
                <strong>Category:</strong> ${chat.category} | 
                <strong>Model:</strong> ${chat.model} | 
                <strong>Messages:</strong> ${chat.messages.length} | 
                <strong>Date:</strong> ${new Date(chat.createdAt).toLocaleString()}
            </div>
        `;

        chat.messages.forEach(msg => {
            const roleLabel = msg.role === 'user' ? '👤 You' : '🤖 AI Assistant';
            htmlContent += `
            <div class="message ${msg.role}">
                <div class="role">${roleLabel}</div>
                <div class="content">${msg.content}</div>
            </div>`;
        });

        htmlContent += `
            <div class="footer">
                Exported from AI Assistant Hub | ${new Date().toLocaleString()} | Total Messages: ${chat.messages.length}
            </div>
        </body></html>`;

        chat.exportCount = (chat.exportCount || 0) + 1;
        await chat.save();

        res.status(200).json({
            success: true,
            html: htmlContent,
            filename: `chat-${chat.title.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.html`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalChats = await Chat.countDocuments({ user: req.user._id });
        const bookmarkedChats = await Chat.countDocuments({ user: req.user._id, isBookmarked: true });
        const pinnedChats = await Chat.countDocuments({ user: req.user._id, isPinned: true });

        const categoryStats = await Chat.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const modelStats = await Chat.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$model', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentChats = await Chat.find({ user: req.user._id })
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('title category model isPinned isBookmarked updatedAt messages');

        const totalMessages = await Chat.aggregate([
            { $match: { user: req.user._id } },
            { $project: { messageCount: { $size: '$messages' } } },
            { $group: { _id: null, total: { $sum: '$messageCount' } } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalChats,
                bookmarkedChats,
                pinnedChats,
                totalMessages: totalMessages[0]?.total || 0,
                categoryStats,
                modelStats,
                recentChats,
                apiUsage: req.user.apiUsage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};