module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
  kafkaBrokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : [],
  gcsBucket: process.env.GCS_BUCKET,
  gcsKeyFile: process.env.GCS_KEY_FILE,
}; 