const express = require("express");
const FAQ = require("../models/faq");
const Redis = require("redis");
const translationService = require('../services/translation/translationService');
const { translateText } = require('../services/translationService');
const cacheService = require('../services/cacheService');

const client = Redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retry_strategy: function(options) {
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
    }
});
    

client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('FAQ Route accessed:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

// Get FAQs with language support
router.get('/', async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const showAll = req.query.showAll === 'true';
        
        const faqs = await FAQ.find();
        
        if (showAll) {
            // Return all language versions
            const formattedFaqs = faqs.map(faq => ({
                id: faq._id,
                translations: {
                    en: {
                        question: faq.question,
                        answer: faq.answer
                    },
                    hi: {
                        question: faq.question,
                        answer: faq.answer_hi
                    },
                    bn: {
                        question: faq.question,
                        answer: faq.answer_bn
                    }
                }
            }));
            return res.json(formattedFaqs);
        }

        // Return specific language
        const formattedFaqs = faqs.map(faq => ({
            id: faq._id,
            question: lang === 'hi' ? faq.question : (lang === 'bn' ? faq.question : faq.question),
            answer: lang === 'hi' ? faq.answer_hi : (lang === 'bn' ? faq.answer_bn : faq.answer),
            language: lang
        }));

        res.json(formattedFaqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create FAQ with translations
router.post('/', async (req, res) => {
    try {
        console.log('Received FAQ data:', req.body);
        const { question, answer } = req.body;

        // Translate to Hindi and Bengali
        const [answerHi, answerBn] = await Promise.all([
            translateText(answer, 'hi'),
            translateText(answer, 'bn')
        ]);

        const faq = new FAQ({
            question: question,
            answer: answer,
            answer_hi: answerHi,
            answer_bn: answerBn
        });

        const savedFaq = await faq.save();
        console.log('Saved FAQ:', savedFaq);

        // Clear cache for all languages
        await Promise.all([
            cacheService.clear('faqs:en'),
            cacheService.clear('faqs:hi'),
            cacheService.clear('faqs:bn')
        ]);

        res.status(201).json(savedFaq);
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
               const cachedFAQ = await client.get(`faq:${req.params.id}`);
        if (cachedFAQ) {
            return res.json(JSON.parse(cachedFAQ));
        }

        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await client.setEx(`faq:${req.params.id}`, 3600, JSON.stringify(faq));
        res.json(faq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { question, answer, question_hi, question_bn } = req.body;
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer, question_hi, question_bn },
            { new: true }
        );
        
        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await Promise.all([
            client.del(`faq:${req.params.id}`),
            client.del('all_faqs')
        ]);

        res.json(updatedFAQ);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        
        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await Promise.all([
            client.del(`faq:${req.params.id}`),
            client.del('all_faqs')
        ]);

        res.json({ message: "FAQ deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        // Update base content
        if (req.body.answer) {
            faq.answer = req.body.answer;
            
            // Generate new translations
            const translatedData = await translationService.translateFAQ({
                answer: req.body.answer
            });

            faq.answer_hi = translatedData.answer_hi;
            faq.answer_bn = translatedData.answer_bn;
            faq.translations_status = {
                hi: true,
                bn: true
            };
            faq.last_translated = new Date();
        }

        await faq.save();
        await client.del(`faq:${req.params.id}`);
        await client.del('all_faqs');
        res.json(faq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get API stats
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            totalFAQs: await FAQ.countDocuments(),
            languages: ['en', 'hi', 'bn'],
            cacheStatus: await cacheService.getStats()
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.use((err, req, res, next) => {
    if (err.name === 'RedisError') {
        console.error('Redis Error:', err);
        
        next();
    } else {
        next(err);
    }
});

module.exports = router;