const FAQ = require("../models/faqModel");
const redisClient = require("../config/redisClient");
const { translate } = require("@vitalets/google-translate-api");

// Get all FAQs
const getFAQs = async (req, res) => {
    try {
        // Check if data is cached
        const cachedFAQs = await redisClient.get("faqs").catch(() => null);
        if (cachedFAQs) {
            return res.status(200).json(JSON.parse(cachedFAQs));
        }

        const faqs = await FAQ.find().sort({ createdAt: -1 }); // Added sorting as per previous implementation
        await redisClient.set("faqs", JSON.stringify(faqs), "EX", 600).catch(() => null);

        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};

// Create new FAQ
const createFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        // Validation
        if (!question || !answer) {
            return res.status(400).json({ message: "Question and answer are required" });
        }

        // Translate both question and answer
        const [question_hi, question_bn, answer_hi, answer_bn] = await Promise.all([
            translate(question, { to: "hi" }).then(res => res.text),
            translate(question, { to: "bn" }).then(res => res.text),
            translate(answer, { to: "hi" }).then(res => res.text),
            translate(answer, { to: "bn" }).then(res => res.text)
        ]);

        const newFAQ = new FAQ({
            question,
            question_hi,
            question_bn,
            answer,
            answer_hi,
            answer_bn
        });

        const savedFAQ = await newFAQ.save();
        await redisClient.del("faqs").catch(() => null);

        res.status(201).json(savedFAQ);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error saving FAQ", error: error.message });
    }
};

// Get Single FAQ by ID
const getFAQById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid FAQ ID format" });
        }

        const cachedFAQ = await redisClient.get(`faq:${id}`).catch(() => null);
        if (cachedFAQ) {
            return res.status(200).json(JSON.parse(cachedFAQ));
        }

        const faq = await FAQ.findById(id);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });

        await redisClient.set(`faq:${id}`, JSON.stringify(faq), "EX", 600).catch(() => null);

        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQ", error: error.message });
    }
};

// Update FAQ
const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        // Validate MongoDB ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid FAQ ID format" });
        }

        // If question or answer is updated, update translations
        if (question || answer) {
            const updates = { ...req.body };
            
            if (question) {
                const [question_hi, question_bn] = await Promise.all([
                    translate(question, { to: "hi" }).then(res => res.text),
                    translate(question, { to: "bn" }).then(res => res.text)
                ]);
                Object.assign(updates, { question_hi, question_bn });
            }

            if (answer) {
                const [answer_hi, answer_bn] = await Promise.all([
                    translate(answer, { to: "hi" }).then(res => res.text),
                    translate(answer, { to: "bn" }).then(res => res.text)
                ]);
                Object.assign(updates, { answer_hi, answer_bn });
            }

            req.body = updates;
        }

        const updatedFAQ = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });

        await Promise.all([
            redisClient.del("faqs").catch(() => null),
            redisClient.del(`faq:${id}`).catch(() => null)
        ]);

        res.status(200).json(updatedFAQ);
    } catch (error) {
        res.status(500).json({ message: "Error updating FAQ", error: error.message });
    }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid FAQ ID format" });
        }

        const deletedFAQ = await FAQ.findByIdAndDelete(id);
        if (!deletedFAQ) return res.status(404).json({ message: "FAQ not found" });

        await Promise.all([
            redisClient.del("faqs").catch(() => null),
            redisClient.del(`faq:${id}`).catch(() => null)
        ]);

        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error: error.message });
    }
};

module.exports = { getFAQs, createFAQ, getFAQById, updateFAQ, deleteFAQ };