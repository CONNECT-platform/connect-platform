const hash = require('object-hash');

const hashSig = function(signature) {
  return hash({
    path: signature.path ? signature.path.replace(/\/$/, "") : '', // No trailing slash
    public: signature.public || false,
    method: (signature.public && signature.method) ? signature.method.toLowerCase() : '', // No method if it's not public
    socket: signature.socket || false
  });
}

module.exports = {
  hashSig
};