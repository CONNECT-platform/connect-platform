const load = require('./load-node');
const { Builder, fromJSON } = require('../builder');


module.exports = function(path, searchPaths, config) {
  let node = load(path, searchPaths);
  if (node)
    new Builder(config).build(fromJSON(node));
}
