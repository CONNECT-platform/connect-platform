const hash = require('object-hash');

module.exports = function(val) {
  return hash(val);
}

module.exports.hashSig = function(signature) {
  return hash({
    path: signature.path,
    public: signature.public || false,
    method: signature.method || '',
    socket: signature.socket || false
  });
}