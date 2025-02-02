const Redis = require('ioredis');

const redis = new Redis({
    host: 'localhost',
    port: 6379
});

redis.set('test', 'Hello Redis!', (err, result) => {
    if (err) {
        console.error('Redis Error:', err);
    } else {
        console.log('Redis Test Result:', result);
        redis.get('test', (err, value) => {
            if (err) {
                console.error('Redis Error:', err);
            } else {
                console.log('Retrieved Value:', value);
            }
            process.exit();
        });
    }
}); 