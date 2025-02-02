const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true  // Add trim for cleaning whitespace
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    question_hi: {
        type: String,
        trim: true
    },
    question_bn: {
        type: String,
        trim: true
    },
    answer_hi: {  // Add Hindi answer
        type: String,
        trim: true
    },
    answer_bn: {  // Add Bengali answer
        type: String,
        trim: true
    },
    askedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {  // Add status field
        type: Boolean,
        default: true
    }
}, {
    timestamps: true  // Add created and updated timestamps
});

// Enhance the translation method to include answers
faqSchema.methods.getTranslatedContent = function(language) {
    let translatedQuestion = this.question;  // default to English
    let translatedAnswer = this.answer;      // default to English

    if (language === "hi") {
        translatedQuestion = this.question_hi || this.question;
        translatedAnswer = this.answer_hi || this.answer;
    } else if (language === "bn") {
        translatedQuestion = this.question_bn || this.question;
        translatedAnswer = this.answer_bn || this.answer;
    }

    return {
        question: translatedQuestion,
        answer: translatedAnswer
    };
};

const FAQs = mongoose.model("FAQs", faqSchema);
module.exports = FAQs;