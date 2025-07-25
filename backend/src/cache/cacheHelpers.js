const redisClient = require('./redisClient');

async function get(key) {
  const data = await redisClient.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

async function set(key, value, ttl = 3600) {
  const str = JSON.stringify(value);
  await redisClient.set(key, str, { EX: ttl });
}

async function del(key) {
  await redisClient.del(key);
}

module.exports = {
  get,
  set,
  del,
}; 