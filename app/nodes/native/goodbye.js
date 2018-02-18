const platform = require('platform');


platform.core.node({
  path: '/goodbye/:dude',
  public: true,
  inputs: ['dude'],
  outputs: ['msg']
}, (inputs, output) => output('msg', `Goodbye ${inputs.dude}!`));
