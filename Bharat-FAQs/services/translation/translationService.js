const { Translate } = require('@google-cloud/translate').v2;

// Initialize the Google Translate API client
const translate = new Translate({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to your service account key file
});

class TranslationService {
    /**
     * Translate text to specified language
     * @param {string} text - Text to translate
     * @param {string} targetLanguage - Language code to translate to
     * @returns {Promise<string>} Translated text
     */
    async translateText(text, targetLanguage) {
        try {
            const [translation] = await translate.translate(text, targetLanguage);
            return translation;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    }

    /**
     * Translate FAQ content to all supported languages
     * @param {Object} faqData - FAQ data with question and answer
     * @returns {Promise<Object>} FAQ data with translations
     */
    async translateFAQ(faqData) {
        try {
            const supportedLanguages = {
                hi: 'Hindi',
                bn: 'Bengali'
            };

            const translations = {};

            // Translate answer to each supported language
            for (const [langCode] of Object.entries(supportedLanguages)) {
                translations[`answer_${langCode}`] = await this.translateText(
                    faqData.answer,
                    langCode
                );
            }

            return {
                ...faqData,
                ...translations
            };
        } catch (error) {
            console.error('FAQ translation error:', error);
            return faqData;
        }
    }
}

module.exports = new TranslationService(); 