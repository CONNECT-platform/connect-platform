const core = require('../core');
const base = require('../core/base');


//TODO: also there are some issues with error handling here.
//
const nativeCall = (pathObject, inputs, callback, error, context) => new Promise((resolve, reject) => {
    let path = pathObject;
    let method = '';

    if(path instanceof Object) {
      path = pathObject.path;
      if('method' in pathObject) {
        method = pathObject.method;
      }
    }
    
    core.callable(() => new core.Call(path, method), context)(inputs).then(result => {
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
