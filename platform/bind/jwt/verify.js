const jwt = require('jsonwebtoken');
const platform = require('../../');


platform.core.node({
  path : '/jwt/verify',
  public : false,
  inputs : ['token'],
  outputs : ['payload'],
  controlOutputs : ['no_secret', 'invalid_token'],
  hints: {
    node: 'verifies and decrypts given <span class="hl-blue">token</span>.',
    inputs: {
      token: 'the jwt token to verify and decrypt.'
    },
    outputs: {
      payload: 'the decrypted version of the payload contained in given <span class="hl">token</span>.'
    },
    controlOutputs: {
      no_secret: 'activates when no jwt secret is defined in the configs.',
      invalid_token: 'activates when given token is not correct, for example signed by a third-party.',
    }
  }
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
