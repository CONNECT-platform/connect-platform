const { Builder, fromJSON } = require('./builder');
const expressBind = require('./bind/express');


class Platform {
  constructor(a, b) {
    if (!b) this.init(null, a);
    else this.init(a, b);
  }

  init(app, config) {
    this.builder = new Builder(config);
    this.app = app;
    this.config = config || {};
  }

  bind() {
    this.app = expressBind(this.app);
  }

  listen(port) {
    return new Promise(resolve => {
      this.bind();
      let server = this.app.listen(port, () => {
        resolve(server);
      });
    });
  }

  start() {
    let port = null;
    if (this.config.port) port = this.config.port.valueOf();
    if (this.config.server && this.config.server.port) port = this.config.server.port.valueOf();

    return this.listen(port);
  }

  configure(conf) {
    this.config = Object.assign(this.config, conf);
    return this;
  }
}

module.exports = (a, b) => new Platform(a, b);
module.exports.core = require('./core');
