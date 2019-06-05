const platform = require('platform');


platform.core.node({
  path: '/funs',
  public: true,
  inputs: ['a'],
  optionalInputs: ['b', 'c', 'also another really important input'],
  outputs: ['ab', 'nob'],
}, (i, o) => {
  if (i.b) o('ab', i.a * i.b);
  else o('nob', i.a);
});
