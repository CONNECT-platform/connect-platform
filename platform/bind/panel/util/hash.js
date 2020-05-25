const hash = require('object-hash');

module.exports = function(val) {
  return hash(val);
}