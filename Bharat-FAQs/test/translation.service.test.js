const chai = require('chai');
const expect = chai.expect;
const translationService = require('../services/translation/translationService');

describe('Translation Service Tests', () => {
    it('should translate text to Hindi', async () => {
        const text = 'Hello';
        const translated = await translationService.translateText(text, 'hi');
        expect(translated).to.be.a('string');
        expect(translated).to.not.equal(text);
    });

    it('should translate FAQ content', async () => {
        const faqData = {
            answer: 'Hello, how are you?'
        };

        const translated = await translationService.translateFAQ(faqData);
        expect(translated).to.have.property('answer_hi');
        expect(translated).to.have.property('answer_bn');
    });

    it('should handle translation errors gracefully', async () => {
        const result = await translationService.translateText('', 'hi');
        expect(result).to.equal('');
    });
});
