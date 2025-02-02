const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server'); // Make sure to export app from server.js
const FAQ = require('../models/faq');

describe('FAQ API Tests', () => {
    beforeEach(async () => {
        await FAQ.deleteMany({});
    });

    describe('POST /api/faqs', () => {
        it('should create a new FAQ', async () => {
            const res = await request(app)
                .post('/api/faqs')
                .send({
                    question: 'Test Question',
                    answer: 'Test Answer'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('question', 'Test Question');
            expect(res.body).to.have.property('answer', 'Test Answer');
            expect(res.body).to.have.property('answer_hi');
            expect(res.body).to.have.property('answer_bn');
        });

        it('should fail without required fields', async () => {
            const res = await request(app)
                .post('/api/faqs')
                .send({});

            expect(res.status).to.equal(400);
        });
    });

    describe('GET /api/faqs', () => {
        beforeEach(async () => {
            await FAQ.create({
                question: 'Test Question',
                answer: 'Test Answer',
                answer_hi: 'Hindi Answer',
                answer_bn: 'Bengali Answer'
            });
        });

        it('should get all FAQs in English', async () => {
            const res = await request(app).get('/api/faqs');
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('answer', 'Test Answer');
        });

        it('should get all FAQs in Hindi', async () => {
            const res = await request(app).get('/api/faqs?lang=hi');
            
            expect(res.status).to.equal(200);
            expect(res.body[0]).to.have.property('answer', 'Hindi Answer');
        });
    });
});
