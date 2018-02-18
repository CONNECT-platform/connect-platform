const platform = require('platform');


platform.core.node({
  path: '/8fact',
  public: true,
  outputs: ['8!'],
}, (_, o) => {
  platform.call('/fact', {n : 8}, res => {
    o('8!', res.data);
  });
});
