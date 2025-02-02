const express = require('express');
const router = express.Router();
const FAQ = require('../models/faqModel');

// Admin dashboard with WYSIWYG editor
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', {
        layout: 'admin',
        title: 'FAQ Admin'
    });
});

// FAQ management routes
router.get('/faqs', async (req, res) => {
    const faqs = await FAQ.find({});
    res.render('admin/faqs/index', { faqs });
});

module.exports = router;