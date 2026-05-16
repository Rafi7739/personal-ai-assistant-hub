// ===== STATE =====
const S = {
    user: null,
    token: localStorage.getItem('token') || null,
    chat: null,
    page: 'dashboard',
    tool: null,
    theme: localStorage.getItem('theme') || 'dark',
    voice: { active: false, recognition: null }
};

// ===== API =====
const API = {
    async req(url, opt = {}) {
        const cfg = {
            headers: { 'Content-Type': 'application/json', ...(S.token ? { Authorization: `Bearer ${S.token}` } : {}) },
            ...opt
        };
        try {
            const r = await fetch(`/api${url}`, cfg);
            const d = await r.json();
            if (!r.ok) { if (r.status === 401) { logout(); } throw new Error(d.message || 'Error'); }
            return d;
        } catch (e) { if (e.message === 'Failed to fetch') throw new Error('Network error'); throw e; }
    },
    get: (u) => API.req(u),
    post: (u, b) => API.req(u, { method: 'POST', body: JSON.stringify(b) }),
    put: (u, b) => API.req(u, { method: 'PUT', body: JSON.stringify(b) }),
    del: (u) => API.req(u, { method: 'DELETE' })
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(S.theme);
    initVoice();

    setTimeout(() => {
        const ls = document.getElementById('loadingScreen');
        ls.classList.add('fade-out');
        setTimeout(() => ls.style.display = 'none', 500);
        S.token ? checkAuth() : showAuth();
    }, 2000);

    // Chat form
    document.getElementById('chatForm').addEventListener('submit', (e) => { e.preventDefault(); sendMsg(); });

    // Chat input
    const ci = document.getElementById('chatInput');
    ci.addEventListener('input', function () {
        document.getElementById('charCt').textContent = this.value.length;
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    ci.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } });

    // Login
    document.getElementById('loginFormEl').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const d = await API.post('/auth/login', {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            });
            S.token = d.token; S.user = d.user;
            localStorage.setItem('token', d.token);
            toast('Welcome back! 🎉', 'success');
            showApp();
        } catch (e) { toast(e.message, 'error'); }
    });

    // Register
    document.getElementById('registerFormEl').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('regPassword').value;
        if (pw !== document.getElementById('regConfirm').value) { toast('Passwords do not match', 'error'); return; }
        try {
            const d = await API.post('/auth/register', {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: pw
            });
            S.token = d.token; S.user = d.user;
            localStorage.setItem('token', d.token);
            toast('Account created! 🚀', 'success');
            showApp();
        } catch (e) { toast(e.message, 'error'); }
    });

    // Close dropdowns
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) document.getElementById('userDrop')?.classList.add('hidden');
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTM(); });
});

// ===== AUTH =====
async function checkAuth() {
    try { const d = await API.get('/auth/me'); S.user = d.user; showApp(); }
    catch { localStorage.removeItem('token'); S.token = null; showAuth(); }
}
function showAuth() { document.getElementById('authPage').classList.remove('hidden'); document.getElementById('mainApp').classList.add('hidden'); }
function showApp() { document.getElementById('authPage').classList.add('hidden'); document.getElementById('mainApp').classList.remove('hidden'); updateUI(); loadDashboard(); }
function showLogin() { document.getElementById('loginForm').classList.remove('hidden'); document.getElementById('registerForm').classList.add('hidden'); }
function showRegister() { document.getElementById('loginForm').classList.add('hidden'); document.getElementById('registerForm').classList.remove('hidden'); }
function logout() {
    API.post('/auth/logout').catch(() => { });
    localStorage.removeItem('token'); S.token = null; S.user = null; S.chat = null;
    showAuth(); toast('Logged out', 'info');
}

// ===== UI =====
function updateUI() {
    if (!S.user) return;
    const ini = S.user.name.charAt(0).toUpperCase();
    const nm = S.user.name;
    document.getElementById('sideAvatar').textContent = ini;
    document.getElementById('topAvatar').textContent = ini;
    document.getElementById('sideName').textContent = nm;
    document.getElementById('dropName').textContent = nm;
    document.getElementById('dropEmail').textContent = S.user.email;
    document.getElementById('greetName').textContent = nm.split(' ')[0];
    document.getElementById('setName').value = nm;
    document.getElementById('setEmail').value = S.user.email;

    const h = new Date().getHours();
    document.getElementById('greetTime').textContent = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
    document.getElementById('darkToggle').checked = S.theme === 'dark';

    if (S.user.preferences?.defaultModel) {
        document.getElementById('setModel').value = S.user.preferences.defaultModel;
        document.getElementById('aiModel').value = S.user.preferences.defaultModel;
    }
}

// ===== NAVIGATION =====
function nav(page, el) {
    S.page = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`pg-${page}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (el) el.classList.add('active');
    else document.querySelectorAll('.nav-item').forEach(n => { if (n.dataset.page === page) n.classList.add('active'); });

    const titles = { dashboard: 'Dashboard', chat: 'AI Chat', tools: 'AI Tools', history: 'Chat History', settings: 'Settings' };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    if (page === 'dashboard') loadDashboard();
    if (page === 'tools') loadTools();
    if (page === 'history') loadHistory();
    if (window.innerWidth <= 768) toggleSidebar();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

function toggleTheme() {
    S.theme = S.theme === 'dark' ? 'light' : 'dark';
    applyTheme(S.theme);
    localStorage.setItem('theme', S.theme);
}

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const ic = document.getElementById('themeIcon');
    if (ic) ic.className = t === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    const tg = document.getElementById('darkToggle');
    if (tg) tg.checked = t === 'dark';
}

function toggleUserMenu() { document.getElementById('userDrop').classList.toggle('hidden'); }
function togglePwd(id, btn) {
    const inp = document.getElementById(id);
    const ic = btn.querySelector('i');
    if (inp.type === 'password') { inp.type = 'text'; ic.className = 'fas fa-eye-slash'; }
    else { inp.type = 'password'; ic.className = 'fas fa-eye'; }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const d = await API.get('/chats/stats/dashboard');
        const s = d.stats;
        document.getElementById('stChats').textContent = s.totalChats;
        document.getElementById('stMsgs').textContent = s.totalMessages;
        document.getElementById('stBooks').textContent = s.bookmarkedChats;
        document.getElementById('stAPI').textContent = s.apiUsage?.totalRequests || 0;

        const used = s.apiUsage?.totalRequests || 0;
        const lim = s.apiUsage?.monthlyLimit || 500;
        document.getElementById('usedCount').textContent = used;
        document.getElementById('usedLimit').textContent = lim;
        document.getElementById('usageFill').style.width = `${Math.min(100, (used / lim) * 100)}%`;

        // Recent activity
        const ra = document.getElementById('recentAct');
        const icons = { general: '💬', coding: '💻', writing: '✍️', analysis: '📊', creative: '🎨', math: '🔢', image: '🖼️' };
        if (s.recentChats?.length > 0) {
            ra.innerHTML = s.recentChats.map(c => `
                <div class="activity-item" onclick="openChat('${c._id}')">
                    <div class="act-icon">${icons[c.category] || '💬'}</div>
                    <div class="act-text"><strong>${esc(c.title)}</strong><small>${c.model || 'built-in'} · ${fmtDate(c.updatedAt)}</small></div>
                </div>`).join('');
        }
        loadSidebarChats(s.recentChats);
    } catch (e) { console.error('Dashboard:', e); }
}

function loadSidebarChats(chats) {
    const el = document.getElementById('recentList');
    const icons = { general: '💬', coding: '💻', writing: '✍️', analysis: '📊', creative: '🎨', math: '🔢', image: '🖼️' };
    if (!chats?.length) { el.innerHTML = '<p style="color:var(--text3);font-size:.78rem;padding:10px">No chats yet</p>'; return; }
    el.innerHTML = chats.map(c => `
        <div class="chat-list-item ${S.chat === c._id ? 'active' : ''}" onclick="openChat('${c._id}')">
            ${c.isPinned ? '<span class="pin-indicator"><i class="fas fa-thumbtack"></i></span>' : ''}
            <span>${icons[c.category] || '💬'}</span>
            <span>${esc(c.title)}</span>
        </div>`).join('');
}

// ===== CHAT =====
function newChat() {
    S.chat = null;
    nav('chat');
    document.getElementById('chatMsgs').innerHTML = `
        <div class="welcome-chat"><div class="wc-icon">🤖</div><h2>How can I help you today?</h2><p>Choose an AI model above and start chatting!</p>
            <div class="chips">
                <button class="chip" onclick="sendChip('Explain JavaScript closures with examples')">💻 JS Closures</button>
                <button class="chip" onclick="sendChip('Write a professional email to my boss')">📧 Write Email</button>
                <button class="chip" onclick="sendChip('Tell me a creative short story')">🎨 Story</button>
                <button class="chip" onclick="sendChip('Calculate 245 * 18 + 72')">🔢 Math</button>
                <button class="chip" onclick="sendChip('Generate an image of a sunset over mountains')">🖼️ Image</button>
                <button class="chip" onclick="sendChip('What can you do? Show me all features')">🆘 Help</button>
            </div>
        </div>`;
}

function sendChip(t) { document.getElementById('chatInput').value = t; sendMsg(); }

async function sendMsg() {
    const inp = document.getElementById('chatInput');
    const msg = inp.value.trim();
    if (!msg || msg.length > 2000) return;

    const model = document.getElementById('aiModel').value;
    const cat = document.getElementById('chatCat').value;
    const isVoice = S.voice.lastWasVoice || false;
    S.voice.lastWasVoice = false;

    inp.value = ''; inp.style.height = 'auto';
    document.getElementById('charCt').textContent = '0';

    addMsg('user', msg, model, isVoice);
    document.getElementById('typingInd').classList.remove('hidden');
    document.getElementById('sendBtn').disabled = true;

    try {
        let d;
        if (S.chat) {
            d = await API.post(`/chats/${S.chat}/messages`, { message: msg, isVoiceInput: isVoice });
        } else {
            d = await API.post('/chats', { message: msg, category: cat, model, isVoiceInput: isVoice });
            S.chat = d.chat._id;
        }
        const msgs = d.chat.messages;
        const last = msgs[msgs.length - 1];
        addMsg('assistant', last.content, last.model || model, false);
    } catch (e) {
        toast(e.message, 'error');
        addMsg('assistant', '❌ Error: ' + e.message, model, false);
    } finally {
        document.getElementById('typingInd').classList.add('hidden');
        document.getElementById('sendBtn').disabled = false;
        inp.focus();
    }
}

function addMsg(role, content, model, isVoice) {
    const el = document.getElementById('chatMsgs');
    const wc = el.querySelector('.welcome-chat');
    if (wc) wc.remove();

    const avatar = role === 'user' ? (S.user?.name?.charAt(0).toUpperCase() || 'U') : '🤖';

    // Render markdown for assistant messages
    let rendered;
    if (role === 'assistant') {
        try {
            rendered = marked.parse(content, { breaks: true, gfm: true });
        } catch { rendered = content.replace(/\n/g, '<br>'); }
    } else {
        rendered = esc(content).replace(/\n/g, '<br>');
    }

    const modelLabels = { 'built-in': '🤖 Built-in', 'gpt': '🟢 GPT', 'gemini': '🔵 Gemini', 'claude': '🟣 Claude' };

    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `
        <div class="msg-avatar">${avatar}</div>
        <div>
            <div class="msg-body">${rendered}</div>
            <div class="msg-meta">
                <span class="model-badge">${modelLabels[model] || model}</span>
                ${isVoice ? '<span class="voice-badge">🎤 Voice</span>' : ''}
                <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>`;

    el.appendChild(div);
    el.scrollTop = el.scrollHeight;

    // Syntax highlighting
    setTimeout(() => {
        div.querySelectorAll('pre code').forEach(block => {
            try { hljs.highlightElement(block); } catch { }
        });
    }, 50);
}

async function openChat(id) {
    try {
        const d = await API.get(`/chats/${id}`);
        S.chat = id;
        nav('chat');

        const el = document.getElementById('chatMsgs');
        el.innerHTML = '';
        document.getElementById('chatCat').value = d.chat.category;
        document.getElementById('aiModel').value = d.chat.model || 'built-in';
        document.getElementById('bmIcon').className = d.chat.isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        document.getElementById('pinIcon').style.color = d.chat.isPinned ? 'var(--warning)' : '';

        d.chat.messages.forEach(m => addMsg(m.role, m.content, m.model || d.chat.model, m.isVoiceInput));
    } catch (e) { toast(e.message, 'error'); }
}

async function bookmarkChat() {
    if (!S.chat) return;
    try {
        const d = await API.put(`/chats/${S.chat}/bookmark`);
        document.getElementById('bmIcon').className = d.isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        toast(d.isBookmarked ? 'Bookmarked ⭐' : 'Removed bookmark', 'success');
    } catch (e) { toast(e.message, 'error'); }
}

async function pinChat() {
    if (!S.chat) return;
    try {
        const d = await API.put(`/chats/${S.chat}/pin`);
        document.getElementById('pinIcon').style.color = d.isPinned ? 'var(--warning)' : '';
        toast(d.isPinned ? 'Pinned 📌' : 'Unpinned', 'success');
    } catch (e) { toast(e.message, 'error'); }
}

function clearChat() {
    if (!S.chat || !confirm('Delete this chat?')) return;
    API.del(`/chats/${S.chat}`).then(() => { toast('Chat deleted', 'info'); newChat(); loadDashboard(); }).catch(e => toast(e.message, 'error'));
}

function changeModel() {
    const m = document.getElementById('aiModel').value;
    const labels = { 'built-in': 'Built-in AI', gpt: 'GPT (OpenAI)', gemini: 'Gemini (Google)', claude: 'Claude (Anthropic)' };
    toast(`Switched to ${labels[m] || m}`, 'info');
}

// ===== EXPORT PDF =====
async function exportChatPDF() {
    if (!S.chat) { toast('No chat to export', 'warning'); return; }
    try {
        toast('Generating PDF...', 'info');
        const d = await API.get(`/chats/${S.chat}/export`);

        // Create blob and download
        const blob = new Blob([d.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Open in new window for printing
        const win = window.open('', '_blank');
        win.document.write(d.html);
        win.document.close();

        // Auto trigger print dialog (acts as PDF save)
        setTimeout(() => {
            win.print();
            toast('PDF ready! Use "Save as PDF" in print dialog 📄', 'success');
        }, 500);

    } catch (e) { toast(e.message, 'error'); }
}

// ===== VOICE INPUT =====
function initVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.log('Speech recognition not supported');
        return;
    }

    S.voice.recognition = new SpeechRecognition();
    S.voice.recognition.continuous = false;
    S.voice.recognition.interimResults = true;
    S.voice.recognition.lang = 'en-US';

    S.voice.recognition.onstart = () => {
        S.voice.active = true;
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('voiceStatus').textContent = '🔴 Listening...';
    };

    S.voice.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('chatInput').value = transcript;
        document.getElementById('charCt').textContent = transcript.length;
    };

    S.voice.recognition.onend = () => {
        S.voice.active = false;
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('voiceStatus').textContent = '';

        const inp = document.getElementById('chatInput');
        if (inp.value.trim()) {
            S.voice.lastWasVoice = true;
            toast('Voice captured! Press send or speak again 🎤', 'success');
        }
    };

    S.voice.recognition.onerror = (e) => {
        S.voice.active = false;
        document.getElementById('voiceBtn').classList.remove('recording');
        document.getElementById('voiceStatus').textContent = '';
        if (e.error !== 'no-speech') {
            toast('Voice error: ' + e.error, 'error');
        }
    };
}

function toggleVoice() {
    if (!S.voice.recognition) {
        toast('Voice input not supported in this browser. Use Chrome!', 'warning');
        return;
    }
    if (S.voice.active) {
        S.voice.recognition.stop();
    } else {
        S.voice.recognition.start();
    }
}

// ===== TOOLS =====
async function loadTools() {
    try {
        const d = await API.get('/tools');
        document.getElementById('toolsGrid').innerHTML = d.tools.map(t => `
            <div class="tool-card" onclick="openTool('${t.name}','${t.title}','${t.icon}')">
                <div class="tool-icon">${t.icon}</div>
                <h4>${t.title}</h4>
                <p>${t.description}</p>
                <span class="tool-badge">${t.category}</span>
            </div>`).join('');
    } catch (e) { toast(e.message, 'error'); }
}

function openTool(name, title, icon) {
    S.tool = name;
    document.getElementById('tmTitle').textContent = `${icon} ${title}`;
    document.getElementById('tmInput').value = '';
    document.getElementById('tmResult').classList.add('hidden');

    let params = '';
    switch (name) {
        case 'text-summarizer':
            params = '<div class="form-group"><label>Length</label><select id="pLen"><option value="short">Short</option><option value="medium" selected>Medium</option><option value="long">Long</option></select></div>'; break;
        case 'code-generator':
            params = '<div class="form-group"><label>Language</label><select id="pLang"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="html">HTML</option><option value="typescript">TypeScript</option><option value="css">CSS</option></select></div>'; break;
        case 'translator':
            params = '<div class="form-group"><label>Target Language</label><select id="pTarget"><option value="spanish">Spanish</option><option value="french">French</option><option value="german">German</option><option value="japanese">Japanese</option><option value="bangla">Bangla</option><option value="arabic">Arabic</option><option value="hindi">Hindi</option><option value="korean">Korean</option></select></div>'; break;
        case 'email-writer':
            params = '<div class="form-group"><label>Tone</label><select id="pTone"><option value="professional">Professional</option><option value="casual">Casual</option><option value="formal">Formal</option></select></div>'; break;
    }
    document.getElementById('tmParams').innerHTML = params;
    document.getElementById('toolModal').classList.remove('hidden');
}

function closeTM() { document.getElementById('toolModal').classList.add('hidden'); S.tool = null; }

async function runTool() {
    const input = document.getElementById('tmInput').value.trim();
    if (!input) { toast('Enter some text', 'warning'); return; }

    const btn = document.getElementById('tmBtn');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const parameters = {};
    const pLen = document.getElementById('pLen'); if (pLen) parameters.length = pLen.value;
    const pLang = document.getElementById('pLang'); if (pLang) parameters.language = pLang.value;
    const pTarget = document.getElementById('pTarget'); if (pTarget) parameters.targetLanguage = pTarget.value;
    const pTone = document.getElementById('pTone'); if (pTone) parameters.tone = pTone.value;

    try {
        const d = await API.post(`/tools/${S.tool}`, { input, parameters });
        const resultEl = document.getElementById('tmResult');

        // Render markdown in tool result
        let rendered;
        try { rendered = marked.parse(d.result.output, { breaks: true, gfm: true }); }
        catch { rendered = d.result.output.replace(/\n/g, '<br>'); }

        document.getElementById('tmResultContent').innerHTML = rendered;
        resultEl.classList.remove('hidden');

        // Syntax highlighting
        setTimeout(() => {
            resultEl.querySelectorAll('pre code').forEach(block => {
                try { hljs.highlightElement(block); } catch { }
            });
        }, 50);

        toast('Done! ✨', 'success');
    } catch (e) { toast(e.message, 'error'); }
    finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-magic"></i> Process'; }
}

function copyResult() {
    const txt = document.getElementById('tmResultContent').innerText;
    navigator.clipboard.writeText(txt).then(() => toast('Copied! 📋', 'success'));
}

function quickAct(a) {
    if (a === 'chat') { newChat(); return; }
    nav('tools');
    setTimeout(() => {
        const tools = {
            'code-generator': ['Code Generator', '💻'], 'email-writer': ['Email Writer', '📧'],
            'text-summarizer': ['Text Summarizer', '📝'], 'grammar-checker': ['Grammar Checker', '✅'],
            'translator': ['Translator', '🌐'], 'image-generator': ['Image Generator', '🖼️'],
            'mood-analyzer': ['Mood Analyzer', '😊']
        };
        if (tools[a]) openTool(a, tools[a][0], tools[a][1]);
    }, 300);
}

// ===== HISTORY =====
async function loadHistory() {
    try {
        const cat = document.getElementById('histFilter')?.value || '';
        const search = document.getElementById('histSearch')?.value || '';
        const d = await API.get(`/chats?category=${cat}&search=${search}&limit=50`);
        const el = document.getElementById('histList');
        const icons = { general: '💬', coding: '💻', writing: '✍️', analysis: '📊', creative: '🎨', math: '🔢', image: '🖼️' };

        if (!d.chats?.length) {
            el.innerHTML = '<div class="empty-state"><span>📭</span><h3>No chats found</h3><p>Start chatting!</p><button class="btn btn-primary" onclick="nav(\'chat\')"><i class="fas fa-plus"></i> New Chat</button></div>';
            return;
        }
        el.innerHTML = d.chats.map(c => `
            <div class="hist-item" onclick="openChat('${c._id}')">
                <div class="hist-icon">${icons[c.category] || '💬'}</div>
                <div class="hist-info">
                    <h4>${c.isPinned ? '📌 ' : ''}${c.isBookmarked ? '⭐ ' : ''}${esc(c.title)}</h4>
                    <p>${c.messageCount || 0} msgs · ${c.model || 'built-in'} · ${c.category} · ${fmtDate(c.updatedAt)}</p>
                </div>
                <div class="hist-actions" onclick="event.stopPropagation()">
                    <button onclick="openChat('${c._id}')" title="Open"><i class="fas fa-external-link-alt"></i></button>
                    <button class="del" onclick="delChat('${c._id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    } catch (e) { toast(e.message, 'error'); }
}

async function delChat(id) {
    if (!confirm('Delete?')) return;
    try { await API.del(`/chats/${id}`); toast('Deleted', 'info'); loadHistory(); loadDashboard(); }
    catch (e) { toast(e.message, 'error'); }
}

// ===== SETTINGS =====
async function saveProfile() {
    const name = document.getElementById('setName').value.trim();
    if (!name) { toast('Name required', 'warning'); return; }
    try {
        const d = await API.put('/auth/profile', { name });
        S.user = { ...S.user, ...d.user };
        updateUI(); toast('Profile saved! ✅', 'success');
    } catch (e) { toast(e.message, 'error'); }
}

async function saveAPIKeys() {
    const model = document.getElementById('setModel').value;
    try {
        await API.put('/auth/profile', { preferences: { defaultModel: model } });
        S.user.preferences.defaultModel = model;
        document.getElementById('aiModel').value = model;
        toast('Settings saved! ✅', 'success');
    } catch (e) { toast(e.message, 'error'); }
}

async function changePwd() {
    const cur = document.getElementById('curPwd').value;
    const nw = document.getElementById('newPwd').value;
    if (!cur || !nw) { toast('Fill both fields', 'warning'); return; }
    if (nw.length < 6) { toast('Min 6 characters', 'warning'); return; }
    try {
        const d = await API.put('/auth/password', { currentPassword: cur, newPassword: nw });
        S.token = d.token; localStorage.setItem('token', d.token);
        document.getElementById('curPwd').value = '';
        document.getElementById('newPwd').value = '';
        toast('Password changed! 🔒', 'success');
    } catch (e) { toast(e.message, 'error'); }
}

// ===== UTILS =====
function toast(msg, type = 'info') {
    const c = document.getElementById('toasts');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || ''}</span> ${esc(msg)}`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

function fmtDate(ds) {
    const d = new Date(ds); const n = new Date(); const diff = n - d;
    const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const dy = Math.floor(diff / 86400000);
    if (m < 1) return 'Just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; if (dy < 7) return `${dy}d ago`;
    return d.toLocaleDateString();
}

function handleSearch(v) { /* future: global search */ }