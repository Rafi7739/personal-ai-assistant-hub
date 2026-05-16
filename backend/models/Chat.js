const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    model: {
        type: String,
        enum: ['built-in', 'gpt', 'gemini', 'claude'],
        default: 'built-in'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    tokens: {
        type: Number,
        default: 0
    },
    isVoiceInput: {
        type: Boolean,
        default: false
    }
});

const ChatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Chat',
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    messages: [MessageSchema],
    category: {
        type: String,
        enum: ['general', 'coding', 'writing', 'analysis', 'creative', 'math', 'image', 'other'],
        default: 'general'
    },
    model: {
        type: String,
        enum: ['built-in', 'gpt', 'gemini', 'claude'],
        default: 'built-in'
    },
    isBookmarked: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    exportCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

ChatSchema.index({ user: 1, createdAt: -1 });
ChatSchema.index({ user: 1, category: 1 });
ChatSchema.index({ user: 1, isBookmarked: 1 });
ChatSchema.index({ user: 1, isPinned: 1 });

module.exports = mongoose.model('Chat', ChatSchema);