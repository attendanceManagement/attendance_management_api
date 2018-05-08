module.exports = (mongoose, config) => {
  const database = mongoose.connection;
  mongoose.Promise = Promise;
  mongoose.connect(config.database, {
    promiseLibrary: global.Promise
  });
  database.on('error', error => console.log(`Connection to Attendance Manager database failed: ${error}`));
  database.on('connected', () => console.log('Connected to Attendance Manager database'));
  database.on('disconnected', () => console.log('Disconnected from Attendance Manager database'));
  process.on('SIGINT', () => {
    database.close(() => {
      console.log('Attendance Manager terminated, connection closed');
      process.exit(0);
    })
  });
};