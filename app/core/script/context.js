const vm = require('vm');


_contexts = {};

const context = _context => {
  let _key = Object.keys(_context).toString();
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
