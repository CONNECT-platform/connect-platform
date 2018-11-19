const platform = require('../../');
const config = require('./util/config');


platform.core.node({
  path : `${config.path}name`,
  method : 'GET',
  public: config.expose,
  outputs : ['name'],
  interconnectible: false,
},
(_, output) => {
  output('name', platform.config.get('name', ''));
});
