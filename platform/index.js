const expressBind = require('./bind/express');
const shellBind = require('./bind/shell');
const loaders = require('./loaders');
const core = require('./core');
const util = require('./util');
const setupSocketInstance = require('./bind/socket.io');

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
    shellBind(this.app, this.config);
    this.publish(Events.bind);
    return this;
  }

  load() {
    loaders.module
      .loadNodesFromConf(this.config.core,
                        [this.config.get('root')],
                        this.config.core);

    //this.config.get('services', []).forEach(service => loaders.service(service));
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

      //
      // this little bit here ensures that unhandled promise rejection
      // will not cause a problem and will be reporter properly.
      //
      process.on('unhandledRejection', r => console.error(r));

      let server = this.app.listen(port, () => {
        if(
          this.config.has('enable_sockets') &&
          this.config.get('enable_sockets')
        ) {
          const { io, sockets } = setupSocketInstance(server);
          this.io = io;
          this.sockets = sockets;
        }

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
