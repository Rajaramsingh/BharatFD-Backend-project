const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

const cacheService = {
    async get(key) {
        return await redis.get(key);
    },
    async set(key, value, expiry = 3600) {
        await redis.setex(key, expiry, value);
    },
    async clear(pattern) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    }
};

module.exports = cacheService; 