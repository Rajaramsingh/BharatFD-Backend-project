const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');
const translationService = require('../services/translation/translationService');
const cacheService = require('../services/cache/redisService');

// Get FAQs with language support
router.get('/faqs', async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const cacheKey = `faqs_${lang}`;
        
        // Check cache first
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const faqs = await FAQ.find({});
        const translatedFaqs = await translationService.translateFAQs(faqs, lang);
        
        // Cache the result
        await cacheService.set(cacheKey, translatedFaqs);
        
        res.json(translatedFaqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Other API endpoints... 