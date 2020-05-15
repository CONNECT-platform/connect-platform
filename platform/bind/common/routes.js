const core = require('../../core');
const { Subscribable } = require('../../core/base/subscribable');

class Routes extends Subscribable {
  constructor(registry) {
    super();
    this._paths = null;
    this._registry = registry;
  }

  public() {
    let res = [];
    for (let [path, methods] of Object.entries(this._registry.registrants)) {
      for(let method in methods) {
        const signature = methods[method].signature;
        if(
          ('public' in signature) &&
          signature.public
        ) {
          res.push(signature);
        }
      }
    }
  
    return res;
  }
}

if (!global.connect_routes_instance)
  global.connect_routes_instance = new Routes(core.registry);

module.exports = global.connect_routes_instance;