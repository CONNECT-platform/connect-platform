const core = require('../../core');
const { Subscribable } = require('../../core/base/subscribable');

class Routes extends Subscribable {
  constructor(registry) {
    super();
    this._registry = registry;
    this.initPaths();
    this._pathsMap = {};

    let handleNewRouteInfoEvent = (registrant) => {
      if(! registrant.signature.public) return;

      if(registrant.signature.path in this._pathsMap) {
        const foundIndex = this._pathsMap[registrant.signature.path];
  
        this._paths[foundIndex] = registrant.signature;
      } else {
        const pushIndex = this._paths.push(registrant.signature) - 1;
  
        this._pathsMap[registrant.signature.path] = pushIndex;
      }
    }

    this._registry.subscribe(registry.events.registered, handleNewRouteInfoEvent);

    let handleNewAliasEvent = (event) => {
      const registryPaths = registry._paths;
      const alias = event.alias;
      let resolved = registry.resolve(alias);
      if (resolved in registryPaths) {
        for(let method in registryPaths[resolved]) {
          let _obj = Object.assign({}, registryPaths[resolved][method]);
          _obj.signature = Object.assign({}, _obj.signature, {
            path: alias,
            resolvedPath : resolved,
          });
          handleNewRouteInfoEvent(_obj);
        }
      }
    }

    this._registry.subscribe(registry.events.aliased, handleNewAliasEvent);
  }

  initPaths() {
    this._paths = [];

    for (let [path, methods] of Object.entries(this._registry.registrants)) {
      for(let method in methods) {
        const signature = methods[method].signature;
        if(
          ('public' in signature) &&
          signature.public
        ) {
          const pushIndex = this._paths.push(signature) - 1;
          this._pathsMap[signature.path] = pushIndex;
        }
      }
    }
  }

  public() {
    return this._paths;
  }

  findPublic(path) {
    let pathToFind = path.replace(/\/$/, '');
    if(pathToFind[0] != '/') pathToFind = '/' + pathToFind;

    return this._paths.find(n => pathToFind === n.path);
  }
}

if (!global.connect_routes_instance)
  global.connect_routes_instance = new Routes(core.registry);

module.exports = global.connect_routes_instance;