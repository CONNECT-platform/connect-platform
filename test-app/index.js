const platform = require('../platform');

platform
  .configure(require('./config'))
  .configure({root: __dirname});

platform.config.autoparseFromEnvironmentVars();

let start = null;

if(! start) {
  start = platform.start()
  .then(server => {
    console.log(`running on http://${server.address().address}` +
                `:${server.address().port}`);
  });
}

module.exports = platform;
module.exports.start = start;