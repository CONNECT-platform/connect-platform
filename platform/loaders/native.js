const load = require('./load-node');


module.exports = function(path, searchPaths, config) {
  let node = load(path, searchPaths);
};
