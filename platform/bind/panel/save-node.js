const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');
const authorize = require('./util/authorize');

const hash = require('./util/hash');

function matchNodes(signature1, signature2) {
  return (
    signature1.public && signature2.public &&
    signature1.method.toLowerCase() == signature2.method.toLowerCase() // Public http node with the same method
  ) ||
  (
    ! signature1.public && ! signature2.public && ! signature1.socket && ! signature2.socket // Internal node
  ) ||
  (
    signature1.socket && signature2.socket // Socket node
  );
}

function loadNodes(nodes) {
  const promises = [];

  for(let k in nodes) {
    let nodefile = path.join(config.directory, config.files.nodedir, nodes[k]);
    
    promises.push(files.json.load(nodefile));
  }

  return Promise.all(promises);
}

function resolveNode(nodes, obj) {
  return new Promise( (resolve, reject) => {
    loadNodes(nodes).then(nodesInfo => {
      for(let k in nodesInfo) {
        const nodeInfo = nodesInfo[k];

        if(matchNodes(obj.signature, nodeInfo)) {
          obj.id = nodes[k];
        }
      }

      resolve(obj);
    });
  });
}

platform.core.node({
  path : `${config.path}save`,
  public : config.expose,
  method : 'POST',
  interconnectible: false,
  inputs : ['connect_token', 'signature', 'id'],
  outputs : ['id'],
  controlOutputs : [
    'no_directory_set',
    'bad_input',
    'internal_error',
    platform.conventions.controls._Unauthorized
  ],
}, (inputs, output, control) => {
  authorize(inputs.connect_token)
    .then(() => {
      if (!config.directory) {
        control('no_directory_set');
        return;
      }

      if (! inputs.signature.path) {
        control('bad_input');
        return;
      }

      const signature = {
        ...inputs.signature,
        key: hash({
          public: inputs.signature.public || false,
          method: inputs.signature.method || '',
          socket: inputs.signature.sokcet || false
        })
      };
      
      if(! signature.public || signature.socket) {
        signature.method = '';
      }

      let pathmapfile = path.join(config.directory, config.files.pathmap);

      files.json.load(pathmapfile, {})
      .then(pathmap => ({
        signature,
        path: inputs.signature.path,
        update_pathmap: false,
        id: null,
        pathmap,
        existing_node: null
      })).then(obj => {
        if(! inputs.id) return obj;
        
        obj.id = inputs.id;
        Object.entries(obj.pathmap)
              .filter(entry => entry[1] == obj.id)
              .forEach(entry => {
                delete obj.pathmap[entry[0]];
              });
        obj.update_pathmap = true;

        return obj;
      }).then(obj => {
        if(obj.id) return obj;

        if(! (obj.path in obj.pathmap)) {
          obj.id = 'n' + Math.random().toString(36).substring(2, 15);
          obj.update_pathmap = true;
        }

        return obj;
      }).then(obj => {
        if(obj.id) return obj;

        // => obj.path in obj.pathmap is true

        let existingNodesForPath = obj.pathmap[obj.path];
        if( ! Array.isArray(existingNodesForPath) ) {
          existingNodesForPath = [ existingNodesForPath ];
        }

        return resolveNode(existingNodesForPath, obj);
      })
      .then(obj => {
        if(! obj.id) { // no matching node signature so let's create a new one
          obj.id = 'n' + Math.random().toString(36).substring(2, 15);
          obj.update_pathmap = true;
        }
        
        return obj;
      })
      .then(obj => {
          if (obj.update_pathmap) {
            if(! Array.isArray(obj.pathmap[obj.path])) {
              if(obj.path in obj.pathmap) {
                obj.pathmap[obj.path] = [ obj.pathmap[obj.path] ];
              } else {
                obj.pathmap[obj.path] = [];
              }
            }
            
            if(obj.pathmap[obj.path].indexOf(obj.id) === -1) {
              obj.pathmap[obj.path].push(obj.id);
            }

            files.json.save(pathmapfile, obj.pathmap)
              .then(() => {})
              .catch(error => {});
          }
          
          let nodefile = path.join(config.directory, config.files.nodedir, obj.id);

          files.json.save(nodefile, obj.signature)
            .then(() => {
              let index = path.join(config.directory, config.files.index);

              files.save(index,
`module.exports.platform = {
  config : require('./${config.files.conf}.json'),
}
`
              ).then(() => {}).catch(error => {});

              let confile = path.join(config.directory, config.files.conf);
              files.json.load(confile, {
                nodes : {
                  json : [],
                }
              }).then(conf => {
                conf.nodes.json = Object.values(obj.pathmap)
                  .map(i => path.join(config.files.nodedir, i));
                files.json.save(confile, conf).then(() => {}).catch(error => {});
              }).catch(error => {});
              output('id', obj.id, true);
            })
            .catch(error => {
              console.log(error);
              control('internal_error', true);
            });
        })
        .catch(error => {
          console.log(error);
          control('internal_error', true);
        });
    })
    .catch(error => {
      console.log(error);
      control(platform.conventions.controls._Unauthorized);
    })
});
