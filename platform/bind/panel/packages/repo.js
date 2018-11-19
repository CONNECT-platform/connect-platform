const axios = require('axios');

const platform = require('../../../');
const config = require('../util/config');


const _Gateway = 'https://raw.githubusercontent.com/loreanvictor/connect-repo/master/gateway.json';

platform.core.node({
  path : `${config.path}packages/repo`,
  public : config.expose,
  method : 'GET',
  interconnectible: false,
  outputs : ['repo'],
}, (inputs, output, control, error) => {
  axios.get(_Gateway)
    .then(response => {
      if (response.data.repository)
        axios.get(response.data.repository).then(response => {
          output('repo', response.data);
        })
        .catch(err => error(err));
      else output('repo', {});
    })
    .catch(err => error(err));
});
