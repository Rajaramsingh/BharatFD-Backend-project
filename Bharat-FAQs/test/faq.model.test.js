const chai = require('chai');
const expect = chai.expect;
const FAQ = require('../models/faq');
const mongoose = require('mongoose');

describe('FAQ Model Test', () => {
    before(async () => {
        await mongoose.connect(process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/faq_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create & save FAQ successfully', async () => {
        const validFAQ = new FAQ({
            question: 'Test Question',
            answer: 'Test Answer',
            answer_hi: 'Hindi Answer',
            answer_bn: 'Bengali Answer'
        });
        const savedFAQ = await validFAQ.save();
        
        expect(savedFAQ._id).to.exist;
        expect(savedFAQ.question).to.equal('Test Question');
        expect(savedFAQ.answer).to.equal('Test Answer');
    });

    it('should fail to save FAQ without required fields', async () => {
        const faqWithoutRequired = new FAQ({});
        let err;
        try {
            await faqWithoutRequired.save();
        } catch (error) {
            err = error;
        }
        expect(err).to.exist;
        expect(err.errors.question).to.exist;
        expect(err.errors.answer).to.exist;
    });
});
