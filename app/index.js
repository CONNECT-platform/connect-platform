const platform = require('../platform');


platform.core.node({
  path: '/',
  public: true,
  outputs: ['msg']
}, (_, output) => output('msg', 'Hellow World!'));

platform()
  .configure({port : 4000})
  .start()
  .then(server => {
    console.log(`running on http://${server.address().address}` +
                `:${server.address().port}`);
  });
