const redis = require("redis");

const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379
});

client.on("error", (err) => {
    console.error("Redis error:", err);
});

// Connect to Redis with error handling
client.connect()
    .then(() => console.log("Redis connected"))
    .catch((err) => console.error("Redis connection error:", err));

// Utility functions for caching
const cacheUtils = {
    // Set data in cache with expiration
    async setCache(key, data, expirationInSeconds = 3600) {
        try {
            await client.setEx(key, expirationInSeconds, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Cache setting error:', error);
            return false;
        }
    },

    // Get data from cache
    async getCache(key) {
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache getting error:', error);
            return null;
        }
    },

    // Delete cache by key
    async deleteCache(key) {
        try {
            await client.del(key);
            return true;
        } catch (error) {
            console.error('Cache deletion error:', error);
            return false;
        }
    }
};

module.exports = { client, cacheUtils };