const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    answer_hi: {
        type: String,
        default: ''
    },
    answer_bn: {
        type: String,
        default: ''
    },
    translations_status: {
        type: Map,
        of: Boolean,
        default: () => ({
            hi: false,
            bn: false
        })
    },
    last_translated: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'faqs'
});

module.exports = mongoose.model('FAQ', faqSchema); 