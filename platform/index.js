const expressBind = require('./bind/express');
const loaders = require('./loaders');
const util = require('./util');

const {Builder} = require('./builder');


class Platform {
  constructor(a, b) {
    if (!b) this.init(null, a);
    else this.init(a, b);
  }

  init(app, config) {
    this.app = app;
    this.config = util.config(config);
    this.builder = new Builder(this.config.core);
  }

  bind() {
    this.app = expressBind(this.app);
  }

  load() {
    if (this.config.has('nodes')) {
      let nodes = this.config.get('nodes');
      for (let [type, list] of Object.entries(nodes)) {
        if (type in loaders) {
          let loader = loaders[type];
          for (let node of list)
            loader(node, this.config.core);
        }
      }
    }
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

module.exports = (a, b) => new Platform(a, b);

module.exports.core = require('./core');
module.exports.call = require('./tools/native-call');
