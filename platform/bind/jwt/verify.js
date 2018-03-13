const jwt = require('jsonwebtoken');
const platform = require('../../');


platform.core.node({
  path : '/jwt/verify',
  public : false,
  inputs : ['token'],
  outputs : ['payload'],
  controlOutputs : ['no_secret', 'invalid_token']
}, (inputs, output, control) => {
  let _conf = platform.config.get('jwt', {});
  if ('secret' in _conf) {
    jwt.verify(inputs.token, _conf.secret, {}, (err, payload) => {
      if (err) {
        control('invalid_token');
      }
      else output('payload', payload);
    });
  }
  else {
    control('no_secret');
  }
});
