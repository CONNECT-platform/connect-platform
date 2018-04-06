const path = require('path');
const Firestore = require('@google-cloud/firestore');

const platform = require('../../');


let config = platform.config.get('firestore', {});
let instance;

if (config.project && config.keyfile) {
  let keyfile = config.keyfile;
  if (!path.isAbsolute(keyfile))
    keyfile = path.join(platform.config.get('root'), keyfile);

  instance = new Firestore({
    projectId: config.project,
    keyFilename: keyfile,
  });
}

module.exports = instance;
