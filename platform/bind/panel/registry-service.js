const platform = require('../../');
const config = require('./util/config');


platform.core.node({
  path : `${config.path}registry`,
  method : 'GET',
  public: config.expose,
  outputs : ['registry'],
},
(_, output) => {
  output('registry', platform.core.registry.registrants);
});
