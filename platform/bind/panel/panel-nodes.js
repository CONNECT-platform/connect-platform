const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');
const authorize = require('./util/authorize');

const hash = require('../../util/hash');

platform.core.node({
  path : `${config.path}nodes`,
  method : 'GET',
  public: config.expose,
  interconnectible: false,
  inputs: ['connect_token'],
  outputs : ['nodes'],
  controlOutputs: [platform.conventions.controls._Unauthorized],
},
(inputs, output, control) => {
  let savePathmap = false;
  const pushFile = (promises, node) => {
    let nodefile = path.join(config.directory, config.files.nodedir, node);

    promises.push(new Promise((resolve, reject) => {
      resolve(
        Promise.all([
          node,
          files.json.load(nodefile, {})
        ])
      );
    }));
  };

  authorize(inputs.connect_token)
  .catch(() => {
    control(platform.conventions.controls._Unauthorized)
  })
  .then(() => {
    let pathmapfile = path.join(config.directory, config.files.pathmap);
    return files.json.load(pathmapfile, {});
  })
  .then(pathmap => {
    const promises = [ pathmap ];

    for(let k in pathmap) {
      const node = pathmap[k];
      
      if(typeof node === 'string') {
        pushFile(promises, node);
      } else if(Array.isArray(node)) {
        for(let i in node) {
          if(typeof node[i] === 'string') {
            pushFile(promises, node[i]);
          }
        }
      }
    }

    return Promise.all(promises);
  })
  .then(results => {
    const pathmap = results[0];

    if(results.length === 1) return pathmap;

    savePathmap = true;
    let i = 1;
    for(let k in pathmap) {
      const node = pathmap[k];
      const nodeInfo = results[i];
      const signature = nodeInfo[1];

      if(typeof node === 'string') {
        pathmap[signature.path] = {
          id: node,
          key: hash.hashSig(signature)
        };

        i++;
      } else if(Array.isArray(node)) {
        for(let c in node) {
          if(typeof node[c] === 'string') {
            pathmap[signature.path][c] = {
              id: node[c],
              key: hash.hashSig(signature)
            };

            i++;
          }
        }
      }
    }

    return pathmap;
  }).then((pathmap) => {
    if(savePathmap) {
      let pathmapfile = path.join(config.directory, config.files.pathmap);

      files.json.save(pathmapfile, pathmap)
      .then(() => {
        output('nodes', pathmap, true);
      });
    } else {
      output('nodes', pathmap, true);
    }
  })
  .catch((err) => {
    console.log(err);
  });
});
