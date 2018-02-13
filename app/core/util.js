const vm = require('vm');


const buildFromFactoryOrClass = factoryOrClass => {
  if (factoryOrClass.toString().startsWith('class'))
    return new factoryOrClass();
  else
    return factoryOrClass();
}

_scripts = {};
_contexts = {};

const evaluate = (expr, context) => {
  let _expr = '___R = ' + expr;
  let _cont = JSON.stringify(context);

  let _script, _context;

  if (!(_expr in _scripts)) {
    _script = new vm.Script(_expr);
    _scripts[_expr] = _script;
  }
  else
    _script = _scripts[_expr];

  if (!(_cont in _contexts)) {
    _context = context;
    vm.createContext(_context);
    _contexts[_cont] = _context;
  }
  else
    _context = _contexts[_cont];

  _scripts[_expr].runInContext(_context);
  return _context.___R;
}

module.exports = {
  buildFromFactoryOrClass: buildFromFactoryOrClass,
  evaluate: evaluate,
}
