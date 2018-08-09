const expressBind = require('./bind/express');
const loaders = require('./loaders');
const core = require('./core');
const util = require('./util');

const {Subscribable} = require('./core/base/subscribable');
const {Builder} = require('./builder');


const Events = {
  bind: 'bind',
}

class Platform extends Subscribable {
  constructor() {
    super();
    this.config = util.config();
    this.builder = new Builder(this.config.core);
  }

  init(app) {
    this.app = app;
    return this;
  }

  bind() {
    this.app = expressBind(this.app, this.config);
    this.publish(Events.bind);
    return this;
  }

  load() {
    loaders.module
      .loadNodesFromConf(this.config.core,
                        [this.config.get('root')],
                        this.config.core);

    this.config.get('services', []).forEach(service => loaders.service(service));
    if (this.config.has('aliases')) {
      for (let [alias, path] of Object.entries(this.config.get('aliases'))) {
        core.registry.alias(alias, path);
      }
    }

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


if (!global.connect_platform_instance)
  global.connect_platform_instance = new Platform();

module.exports = global.connect_platform_instance;

module.exports.events = Events;
module.exports.core = require('./core');
module.exports.call = require('./tools/native-call');

module.exports.conventions = require('./conventions');
