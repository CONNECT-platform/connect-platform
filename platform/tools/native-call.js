const core = require('../core');
const base = require('../core/base');


//TODO: also there are some issues with error handling here.
//
const nativeCall = (path, inputs, callback, error) => new Promise((resolve, reject) => {
    core.callable(() => new core.Call(path))(inputs).then(result => {
      if (callback) try {
        callback(result);
      } catch(err) {
        if (!(err instanceof base.node.Break) && error)
          error(err);
      }

      resolve(result);
    }).catch(err => {
      if (!(err instanceof base.node.Break)) {
        if (error) error(err);
        reject(err);
      }
    });
});

module.exports = nativeCall;
