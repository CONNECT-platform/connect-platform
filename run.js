const nodemon = require('nodemon');

nodemon({ script: 'app' });

nodemon.on('exit', () => process.exit(0));
