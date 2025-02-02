const translate = require('translate-google');

const translateText = async (text, targetLang) => {
    try {
        console.log(`Translating to ${targetLang}:`, text);
        const translation = await translate(text, { 
            to: targetLang,
            timeout: 10000  // Increase timeout
        });
        console.log('Translation result:', translation);
        return translation;
    } catch (error) {
        console.error('Translation error:', error);
        return ''; // Return empty string if translation fails
    }
};

module.exports = { translateText }; 