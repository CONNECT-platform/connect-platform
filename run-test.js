const nodemon = require('nodemon');

nodemon({ script: 'test-app' });

nodemon.on('start', () => {
  console.log('starting the test platform ...');
});
nodemon.on('crash', () => process.exit(0));

module.exports = {
  nodemon
};