const platform = require('platform');


platform.core.node({
  path: '/',
  public: true,
  outputs: ['msg']
}, (_, output, __, error) => output('Hellow World!'));

platform.core.node({
  path: '/error',
  public: true,
  outputs: ['msg']
}, (_, output, __, error) => {
  new Promise((resolve, reject) => {
    setTimeout(() => reject(), 1);
  }).then(() => output('msg', 'Hellow World!'))
    .catch(() => {
      //throw new Error('some error happend');
      error(new Error('some error happend'));
    });
});
