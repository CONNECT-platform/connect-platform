describe('platform', ()=> {
  require('../core/base/test');
  require('../core/test');

  require('../builder/test');
  require('../recorder/test');

  require('../bind/express/test');
  require('../bind/socket.io/test');
  require('../bind/common/test');
  require('../util/test');

  require('../bind/panel/test/index');
});
