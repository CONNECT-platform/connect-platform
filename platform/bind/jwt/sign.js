const jwt = require('jsonwebtoken');
const platform = require('../../');


platform.core.node({
  path: '/jwt/sign',
  public: false,
  inputs: ['payload'],
  outputs: ['token'],
  controlOutputs: ['no_secret'],
  hints: {
    node: 'signs and encrypts given <span class="hl-blue">payload</span>.',
    inputs: {
      payload: 'the payload to sign'
    },
    outputs: {
      token: 'the signed and encrypted jwt token containing the given <span class="hl-blue">payload</span>.'
    },
    controlOutputs: {
      no_secret: 'activates when a jwt secret is not set in project configs.'
    }
  }
}, (inputs, output, control) => {
  let _conf = platform.config.get('jwt', {});
  if ('secret' in _conf)
    jwt.sign(inputs.payload, _conf.secret, {}, (_, token) => output('token', token));
  else {
    control('no_secret');
  }
});
