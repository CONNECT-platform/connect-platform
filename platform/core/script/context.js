const vm = require('vm');
const hash = require('object-hash');

_contexts = {};

const context = (_context, inputs) => {
  let _key = hash(inputs, { ignoreUnknown: true });
  let _cont;

  if (_key in _contexts)
    _cont = _contexts[_key];
  else {
    _cont = {};
    for (let _k of Object.keys(_context))
      _cont[_k] = null;

    vm.createContext(_cont);
    _contexts[_key] = _cont;
  }

  for (let [_k, _v] of Object.entries(_context))
    _cont[_k] = _v;

  return _cont;
}

module.exports = context;
