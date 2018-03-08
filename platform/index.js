const expressBind = require('./bind/express');
const loaders = require('./loaders');
const util = require('./util');

const {Builder} = require('./builder');


class Platform {
  constructor() {
    this.config = util.config();
    this.builder = new Builder(this.config.core);
  }

  init(app) {
    this.app = app;
    return this;
  }

  bind() {
    this.app = expressBind(this.app, this.config);
    return this;
  }

  load() {
    loaders.module
      .loadNodesFromConf(this.config.core,
                        [this.config.get('root')],
                        this.config.core);
    return this;
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
    this.load();

    let port = null;
    if (this.config.has('port')) port = this.config.get('port');

    return this.listen(port);
  }

  configure(config) {
    this.config.append(config);
    return this;
  }
}

const _platform = new Platform();

module.exports = _platform;

module.exports.core = require('./core');
module.exports.call = require('./tools/native-call');
