const Redis = require('ioredis');

class CacheService {
    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379,
            maxRetriesPerRequest: 1,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.redis.on('connect', () => {
            console.log('✅ Cache service connected successfully');
        });

        this.redis.on('error', (err) => {
            console.error('❌ Cache service error:', err);
        });
    }

    async get(key) {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Cache GET Error:', error);
            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Cache SET Error:', error);
            return false;
        }
    }

    async delete(key) {
        try {
            await this.redis.del(key);
            return true;
        } catch (error) {
            console.error('Redis DELETE Error:', error);
            return false;
        }
    }

    generateFAQKey(faqId, lang) {
        return `faq:${faqId}:${lang}`;
    }
}

module.exports = new CacheService(); 