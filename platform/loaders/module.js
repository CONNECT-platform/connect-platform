const path = require('path');
const load = require('./load-node');


const loaders = {
  native: require('./native'),
  json: require('./json'),

  module: function(path, searchPaths, config) {
    load(path, searchPaths, (mod, modPath) => {
      if (mod && mod.platform) {
        if (mod.platform.config) {
          loadNodesFromConf(mod.platform.config, [modPath], config);
        }
      }
    });
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
