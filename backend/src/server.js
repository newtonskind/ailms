const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();
const redisClient = require('./cache/redisClient');

const PORT = process.env.PORT || 5000;
// console.log(process.env.MONGO_URI);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ailms';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis client disconnected');
});

(async () => {
  try {
    await redisClient.set('test_key', 'test_value');
    const value = await redisClient.get('test_key');
    console.log('Redis test value:', value); // Should print: test_value
  } catch (err) {
    console.error('Redis test failed:', err);
  }
})();
