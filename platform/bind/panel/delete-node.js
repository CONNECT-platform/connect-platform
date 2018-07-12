const fs = require('fs');
const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const files = require('./util/file-io');


platform.core.node({
  path : `${config.path}delete/:id`,
  public : config.expose,
  method : 'DELETE',
  inputs : ['id'],
  controlOutputs : ['deleted', 'no_directory_set', 'internal_error'],
}, (inputs, _, control) => {
  if (!config.directory)
    control('no_directory_set');

  let pathmapfile = path.join(config.directory, config.files.pathmap);

  files.json.load(pathmapfile, {})
    .then(pathmap => {
      let paths = Object.entries(pathmap)
            .filter(entry => entry[1] == inputs.id)
            .map(entry => entry[0])
            .forEach(path => { delete pathmap[path]; });

      files.json.save(pathmapfile, pathmap);

      let confile = path.join(config.directory, config.files.conf);
      files.json.load(confile, {
        nodes: { json: [] },
      }).then(conf => {
        let relativeNodeFile = path.join(config.files.nodedir, inputs.id);

        conf.nodes.json = conf.nodes.json.filter(addr => addr != relativeNodeFile);
        files.json.save(confile, conf);

        let nodefile = path.join(config.directory, relativeNodeFile + '.json');
        fs.unlink(nodefile, err => {
          if (err) {
            console.log(err);
            control('internal_error');
          }
          else control('deleted');
        });
      });
    })
    .catch(error => {
      console.log(error);
      control('internal_error');
    });
});
