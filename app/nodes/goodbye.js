const platform = require('../../platform');


platform.core.node({
  path: '/goodbye',
  public: true,
  outputs: ['msg']
}, (_, output) => output('msg', 'Goodbye World!'));
