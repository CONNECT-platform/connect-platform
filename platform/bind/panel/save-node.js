const path = require('path');

const platform = require('../../');
const config = require('./config');
const files = require('./util/file-io');


platform.core.node({
  path : `${config.path}save`,
  public : config.expose,
  method : 'POST',
  inputs : ['signature'],
  outputs : ['id'],
  controlOutputs : ['no_directory_set', 'bad_input', 'internal_error'],
}, (inputs, output, control) => {
  if (!config.directory)
    control('no_directory_set');

  if (!inputs.signature.path)
    control('bad_input');

  let pathmapfile = path.join(config.directory, config.files.pathmap);

  files.json.load(pathmapfile, {})
    .then(pathmap => {
      let _path = inputs.signature.path;
      let _id;

      if (_path in pathmap) {
        _id = pathmap[_path];
      }
      else {
        _id = 'n' + Math.random().toString(36).substring(2, 15);
        pathmap[_path] = _id;
        files.json.save(pathmapfile, pathmap)
          .then(() => {})
          .catch(error => {});
      }

      let nodefile = path.join(config.directory, config.files.nodedir, _id);

      files.json.save(nodefile, inputs.signature)
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
            conf.nodes.json = Object.values(pathmap)
              .map(i => path.join(config.files.nodedir, i));
            files.json.save(confile, conf).then(() => {}).catch(error => {});
          }).catch(error => {});

          output('id', _id);
        })
        .catch(error => {
          console.log(error);
          control('internal_error')
        });
    })
    .catch(error => {
      console.log(error);
      control('internal_error')
    });
});
