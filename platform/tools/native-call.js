const core = require('../core');


const nativeCall = (path, inputs) => {
  return core.callable(() => new core.Call(path))(inputs);
}

module.exports = nativeCall;
