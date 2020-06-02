const hash = require('object-hash');

const hashSig = function(signature) {
  return hash({
    path: signature.path,
    public: signature.public || false,
    method: signature.method ? signature.method.toLowerCase() : '',
    socket: signature.socket || false
  });
}

module.exports = {
  hashSig
};