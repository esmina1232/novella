const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDatabase() {
  const preferredUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/novella';

  try {
    if (preferredUri) {
      await mongoose.connect(preferredUri);
      console.log('MongoDB connected using MONGODB_URI');
      return;
    }
  } catch (error) {
    console.warn('Не удалось подключиться по MONGODB_URI, пробуем локальную MongoDB...', error.message);
  }

  try {
    await mongoose.connect(localUri);
    console.log('MongoDB connected using local database:', localUri);
    return;
  } catch (error) {
    console.warn('Локальная MongoDB недоступна, запускаем временную MongoDB для разработки...', error.message);
  }

  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: 'novella' }
  });

  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('MongoDB Memory Server connected:', memoryUri);
}

async function disconnectDatabase() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
  }
}

module.exports = { connectDatabase, disconnectDatabase };
