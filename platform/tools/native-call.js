const core = require('../core');
const base = require('../core/base');


const nativeCall = (path, inputs, callback, error) => {
    core.callable(() => new core.Call(path))(inputs).then(result => {
      if (callback) try {
        callback(result);
      } catch(err) {
        if (!(err instanceof base.node.Break) && error)
          error(err);
      }
    }).catch(err => {
      if (!(err instanceof base.node.Break) && error)
        error(err);
    });
}

module.exports = nativeCall;
