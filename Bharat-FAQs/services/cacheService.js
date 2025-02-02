const Redis = require('redis');

// Create Redis client
const client = Redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Connect to Redis
client.connect().catch(console.error);

// Handle Redis errors
client.on('error', (err) => console.log('Redis Client Error', err));

// Cache operations
const cacheService = {
    // Set data in cache
    async set(key, value, expiry = 3600) {
        try {
            await client.set(key, JSON.stringify(value), 'EX', expiry);
        } catch (error) {
            console.error('Cache set error:', error);
        }
    },

    // Get data from cache
    async get(key) {
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    // Delete from cache
    async del(key) {
        try {
            await client.del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    },

    // Clear all cache
    async clear() {
        try {
            await client.flushAll();
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
};

module.exports = cacheService;