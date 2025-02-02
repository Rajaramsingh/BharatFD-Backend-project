const translationService = require('../services/translation/translationService');

const translationMiddleware = async (req, res, next) => {
    // Add language detection from request headers
    req.preferredLanguage = req.headers['accept-language']?.split(',')[0] || 'en';
    
    // Add translation helper to response locals
    res.locals.translate = async (text, targetLang) => {
        if (!text) return '';
        return await translationService.translateText(text, targetLang);
    };
    
    next();
};

module.exports = translationMiddleware; 