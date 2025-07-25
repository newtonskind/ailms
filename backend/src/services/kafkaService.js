const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ailms-backend',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
  if (!producer.isConnected()) {
    await producer.connect();
  }
}

async function publishNotification(notification) {
  await connectProducer();
  await producer.send({
    topic: 'notification-events',
    messages: [
      { value: JSON.stringify(notification) }
    ]
  });
}

module.exports = {
  publishNotification
}; 