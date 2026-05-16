const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./backend/config/db');
const errorHandler = require('./backend/middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/chats', require('./backend/routes/chat'));
app.use('/api/tools', require('./backend/routes/tools'));

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📱 Open: http://localhost:${PORT}\n`);
});

process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    server.close(() => process.exit(1));
});