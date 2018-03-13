const jwt = require('jsonwebtoken');
const platform = require('../../');


platform.core.node({
  path: '/jwt/sign',
  public: false,
  inputs: ['payload'],
  outputs: ['token'],
  controlOutputs: ['no_secret'],
}, (inputs, output, control) => {
  let _conf = platform.config.get('jwt', {});
  if ('secret' in _conf)
    jwt.sign(inputs.payload, _conf.secret, {}, (_, token) => output('token', token));
  else {
    control('no_secret');
  }
});
