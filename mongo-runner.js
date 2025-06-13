const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: { port: 27017, dbName: 'vacation_app' }
    });
    console.log(`MongoMemoryServer started on port ${mongod.instanceInfo.port}`);
    const cleanup = async () => {
      await mongod.stop();
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.stdin.resume();
  } catch (err) {
    console.error('Failed to start MongoMemoryServer', err);
    process.exit(1);
  }
})();

