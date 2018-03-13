const path = require('path');

const platform = require('../../');
const config = require('./config');
const files = require('./util/file-io');


platform.core.node({
  path : `${config.path}nodes`,
  method : 'GET',
  public: config.expose,
  outputs : ['nodes'],
},
(_, output) => {
  let pathmapfile = path.join(config.directory, config.files.pathmap);
  files.json.load(pathmapfile, {}).then(pathmap => {
    output('nodes', pathmap, true);
  });
});
