const path = require('path');
const load = require('./load-node');
const external = require('./load-external');
const core = require('../core');


const loaders = {
  native: require('./native'),
  json: require('./json'),
  service: require('./service'),

  module: function(path, searchPaths, config) {
    const callback = (mod, modPath, callback) => {
      if (mod && mod.platform) {
        if (mod.platform.config) {
          loadNodesFromConf(mod.platform.config, [modPath], config);

          if (mod.platform.config.aliases) {
            for (let [alias, path] of Object.entries(mod.platform.config.aliases)) {
              core.registry.alias(alias, path);
            }
          }
        }
      }

      if (callback) callback();
    };

    if (typeof path != 'string')
      external(path, callback);
    else
      load(path, searchPaths, callback);
  },
};

const loadNodesFromConf = function(config, searchPaths, globalConf) {
  if (config.nodes) {
    for (let [type, list] of Object.entries(config.nodes)) {
      if (type in loaders) {
        let loader = loaders[type];
        for (let node of list)
          loader(node, searchPaths, globalConf);
      }
    }
  }
}

module.exports = loaders.module;
module.exports.loadNodesFromConf = loadNodesFromConf;
