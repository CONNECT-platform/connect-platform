const platform = require('../../');
const config = require('./util/config');


//TODO: make this an authorized node.
//

platform.core.node({
  path : `${config.path}registry`,
  method : 'GET',
  public: config.expose,
  interconnectible: false,
  outputs : ['registry'],
},
(_, output) => {
  output('registry', platform.core.registry.registrants);
});
