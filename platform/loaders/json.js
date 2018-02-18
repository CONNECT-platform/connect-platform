const load = require('./load-node');
const { Builder, fromJSON } = require('../builder');


module.exports = function(path, config) {
  let node = load(path, config);
  if (node)
    new Builder(config).build(fromJSON(node));
}
