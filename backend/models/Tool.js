const mongoose = require('mongoose');

const ToolUsageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toolName: {
        type: String,
        required: true,
        enum: [
            'text-summarizer', 'code-generator', 'image-describer',
            'translator', 'email-writer', 'essay-writer',
            'grammar-checker', 'mood-analyzer', 'recipe-generator',
            'quiz-generator', 'image-generator'
        ]
    },
    input: { type: String, required: true },
    output: { type: String, required: true },
    parameters: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
    timestamps: true
});

ToolUsageSchema.index({ user: 1, toolName: 1, createdAt: -1 });

module.exports = mongoose.model('ToolUsage', ToolUsageSchema);