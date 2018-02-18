const expressBind = require('./bind/express');
const util = require('./util');


class Platform {
  constructor(a, b) {
    if (!b) this.init(null, a);
    else this.init(a, b);
  }

  init(app, config) {
    this.app = app;
    this.config = util.config(config);
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
    if (this.config.has('port')) port = this.config.get('port');

    return this.listen(port);
  }

  configure(config) {
    this.config.append(config);
    return this;
  }
}

module.exports = (a, b) => new Platform(a, b);
module.exports.core = require('./core');
