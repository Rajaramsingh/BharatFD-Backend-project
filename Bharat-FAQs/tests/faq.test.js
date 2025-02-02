const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');
const FAQ = require('../models/faq');
const { translateText } = require('../services/translationService');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await FAQ.deleteMany({});
});

describe('FAQ API', () => {
    describe('POST /api/faqs', () => {
        it('should create a new FAQ', async () => {
            const res = await request(app)
                .post('/api/faqs')
                .send({
                    question: 'Test Question?',
                    answer: 'Test Answer'
                });
            expect(res.status).toBe(201);
            expect(res.body.question).toBe('Test Question?');
        });
    });

    describe('GET /api/faqs', () => {
        it('should return FAQs in requested language', async () => {
            // Create test FAQ
            await FAQ.create({
                question: {
                    en: 'Test Question',
                    hi: 'टेस्ट प्रश्न',
                    bn: 'টেস্ট প্রশ্ন'
                },
                answer: {
                    en: 'Test Answer',
                    hi: 'टेस्ट उत्तर',
                    bn: 'টেস্ট উত্তর'
                }
            });

            const response = await request(app)
                .get('/api/faqs?lang=hi');

            expect(response.status).toBe(200);
            expect(response.body[0].question).toBe('टेस्ट प्रश्न');
        });
    });
}); 