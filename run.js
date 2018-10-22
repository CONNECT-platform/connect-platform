const nodemon = require('nodemon');

nodemon({ script: 'app' });

nodemon.on('start', () => console.log('starting the platform ...'));
nodemon.on('crash', () => process.exit(0));
