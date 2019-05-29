const proxy = require('./proxy');
const run = require('./run');
const token = require('./token');
const config = require('./config');

const info = {};

module.exports = (app, conf) => {
  let _conf = config(conf);

  if (_conf.enabled) {
    const credentials = token();

    run(credentials).on('exit', () => {
      info.running = false;
    });

    app.use(proxy(credentials, _conf));

    info.running = true;
    info.config = _conf;
  }
  else {
    info.running = false;
  }
}

module.exports.info = info;
