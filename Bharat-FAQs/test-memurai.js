const Redis = require('ioredis');

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: 1
});

// Test connection
redis.on('connect', () => {
    console.log('✅ Successfully connected to Memurai!');
    
    // Test setting and getting a value
    redis.set('test-key', 'Hello from Memurai!', (err, result) => {
        if (err) {
            console.error('❌ Error setting value:', err);
        } else {
            console.log('✅ Value set successfully:', result);
            
            redis.get('test-key', (err, value) => {
                if (err) {
                    console.error('❌ Error getting value:', err);
                } else {
                    console.log('✅ Retrieved value:', value);
                }
                process.exit();
            });
        }
    });
});

redis.on('error', (err) => {
    console.error('❌ Memurai connection error:', err);
    process.exit(1);
}); 