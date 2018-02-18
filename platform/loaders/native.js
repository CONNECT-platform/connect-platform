const load = require('./load-node');


module.exports = function(path, config) {
  let node = load(path, config);
};
