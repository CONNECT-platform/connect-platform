const path = require('path');
const platform = require('../platform');


platform()
  .configure(require('./config'))
  .configure({root: __dirname})
  .start()
  .then(server => {
    console.log(`running on http://${server.address().address}` +
                `:${server.address().port}`);
  });
