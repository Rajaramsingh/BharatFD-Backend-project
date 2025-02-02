const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');
const { translateText } = require('../services/translationService');
const cacheService = require('../services/cacheService');

// Create FAQ with translations
router.post('/faqs', async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        // Translate to Hindi and Bengali
        const answer_hi = await translateText(answer, 'hi');
        const answer_bn = await translateText(answer, 'bn');

        const faq = new FAQ({
            question,
            answer,
            answer_hi,
            answer_bn
        });

        await faq.save();
        
        // Cache the new FAQ
        await cacheService.set(`faq:${faq._id}`, faq);

        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get FAQs with language support
router.get('/faqs', async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const cacheKey = `faqs:${lang}`;

        // Check cache first
        const cached = await cacheService.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        // Get from database if not in cache
        const faqs = await FAQ.find();
        
        // Format response based on language
        const formattedFaqs = faqs.map(faq => ({
            question: faq.question,
            answer: lang === 'hi' ? faq.answer_hi : 
                    lang === 'bn' ? faq.answer_bn : 
                    faq.answer
        }));

        // Cache the results
        await cacheService.set(cacheKey, formattedFaqs);

        res.json(formattedFaqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;