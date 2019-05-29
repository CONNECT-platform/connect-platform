const platform = require('../../');

const config = require('./util/config');
const authorize = require('./util/authorize');

const shellauth = require('../shell/auth');
const shell = require('../shell');


platform.core.node({
  path : `${config.path}shell-url`,
  method : 'GET',
  public: config.expose,
  inputs: ['connect_token'],
  outputs : ['url'],
  controlOutputs: [
    platform.conventions.controls._Unauthorized,
    platform.conventions.controls._InternalError,
    platform.conventions.controls._NotFound,
  ],
  interconnectible: false,
},
(inputs, output, control) => {
  if (shell.info.running) {
    authorize(inputs.connect_token)
      .then(() => {
        shellauth.sign()
          .then(token => output('url', shell.info.config.path + `?token=${token}`))
          .catch(error => control('no_shell'));
      })
      .catch(error => {
        control(platform.conventions.controls._InternalError,);
      });
  }
  else control(platform.conventions.controls._NotFound);
});
