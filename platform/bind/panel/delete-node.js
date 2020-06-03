const fs = require('fs');
const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');

const lockFile = require('./util/lockFile');

platform.core.node({
  path : `${config.path}delete/:id`,
  public : config.expose,
  interconnectible: false,
  method : 'DELETE',
  inputs : ['id'],
  controlOutputs : ['deleted', 'no_directory_set', 'internal_error'],
}, (inputs, _, control) => {
  if (!config.directory)
    control('no_directory_set');

  const pathmapfile = path.join(config.directory, config.files.pathmap);
  const pathmapfileLock = path.join(config.directory, config.files.pathmap + '.lock');


  lockFile.lock(pathmapfileLock)
  .then(() => files.json.load(pathmapfile, {}))
  .then(pathmap => {
    Object.entries(pathmap).forEach(entry => {
      if(Array.isArray(pathmap[entry[0]])) {
        pathmap[entry[0]] = pathmap[entry[0]].filter(
          el =>
          (typeof el === 'string' && el !== inputs.id) ||
          (typeof el === 'object' && el.id !== inputs.id)
        );

        if(pathmap[entry[0]].length === 0) {
          delete pathmap[entry[0]];
        }
      } else if(
        typeof pathmap[entry[0]] === 'object' &&
        'id' in pathmap[entry[0]] &&
        pathmap[entry[0]].id === inputs.id
      ) {
        delete pathmap[entry[0]];
      }
    });

    files.json.save(pathmapfile, pathmap);

    let confile = path.join(config.directory, config.files.conf);
    files.json.load(confile, {
      nodes: { json: [] },
    }).then(conf => {
      let relativeNodeFile = path.join(config.files.nodedir, inputs.id);

      conf.nodes.json = conf.nodes.json.filter(addr => addr != relativeNodeFile);
      files.json.save(confile, conf);

      let nodefile = path.join(config.directory, relativeNodeFile);

      files.json.delete(nodefile)
        .then(() => control('deleted'))
        .catch(error => control('internal_error'));
    });
  })
  .catch(error => {
    console.log(error);
    control('internal_error');
  })
  .then(() => lockFile.unlock(pathmapfileLock));
});
