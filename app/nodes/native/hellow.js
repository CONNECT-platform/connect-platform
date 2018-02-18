const platform = require('platform');


platform.core.node({
  path: '/',
  public: true,
  outputs: ['msg']
}, (_, output) => output('msg', 'Hellow World!'));
