const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'UCuZ8rTRwMh4p9aFWa6fpOdzIWf62ugU',
    socket: {
        host: 'redis-17537.c245.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 17537
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    if (!client.isOpen) {
        await client.connect();
    }
})();

module.exports = client; 