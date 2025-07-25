const { createClient } = require('redis');

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    if (!client.isOpen) {
        await client.connect();
    }
})();

module.exports = client; 
