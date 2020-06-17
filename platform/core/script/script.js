const vm = require('vm');
const context = require('./context');


const _Result_Key = '___R';

class Script {
  constructor(_script) {
    this._script = new vm.Script(_Result_Key + ' = ' + _script);
  }

  evaluate(_context, inputs = {}) {
    let _cont = context(_context, inputs);
    this._script.runInContext(_cont);
    return _cont[_Result_Key];
  }
}

_scripts = {};

const script = _script => {
  if (_script in _scripts)
    return _scripts[_script];

  let _s = new Script(_script);
  _scripts[_script] = _s;
  return _s;
}

module.exports = script;
