const axios = require('axios');
const core = require('../core');
const ct = require('../util/color-text');

global.connect_platform_service_dependencies = global.connect_platform_service_dependencies || {};

module.exports = (service) => {

  if (service.url.indexOf('://') == -1)
    service.url = 'http://' + service.url;

  console.log(`${ct(ct.blue + ct.bright, 'connecting to service')} ${service.name} ${ct(ct.reverse, `@${service.url}`)}`);
  axios.get(service.url + '/api').then(response => {
    if (response.data) {

      global.connect_platform_service_dependencies[service.name] = {
        signatures: []
      };

      response.data.forEach(signature => {
        let sig = Object.assign({}, signature, {
          path: `${service.name}:${signature.path}`,
          public: false,
          outputs: signature.outputs || [],
        });

        sig.outputs.push('#error');

        let method = (signature.method)?(signature.method.toLowerCase()):('get');

        global.connect_platform_service_dependencies[service.name].signatures.push(sig);

        //TODO: this should be moved to its own separate module.
        //
        core.node(sig, (inputs, output, control, error) => {
          let path = signature.path;
          signature.inputs.forEach(input => {
            path = path.replace(':' + input, inputs[input]);
          });

          let req;

          if (method == 'get') req = axios.get(service.url + path, { params: inputs });
          if (method == 'post') req = axios.post(service.url + path, inputs);
          if (method == 'put') req = axios.put(service.url + path, inputs);
          if (method == 'delete') req = axios.delete(service.url + path, { params: inputs});

          if (!req) {
            output('#error', 'protocol mismatch');
            return;
          }

          req.then(response => {
              if (response.data) {
                if (typeof response.data === 'string') {
                  if (signature.controlOutputs.includes(response.data)) {
                    control(response.data);
                    return;
                  }
                }
                else {
                  let keys = Object.keys(response.data);
                  for (let key of keys) {
                    if (signature.outputs.includes(key)) {
                      output(key, response.data[key]);
                      return;
                    }
                  }
                }

                output('#error', 'signature mismatch');
              }

              output('#error', 'protocol mismatch');
            })
            .catch(err => {
              if (err.response && err.response.data) output('#error', err.response.data);
              else output('#error', err);
            });
        });
      })
    }
  }).catch(error => {
    console.log(`${ct(ct.red + ct.bright, 'ERROR:: could not connect to')} ${service.name} ${ct(ct.reverse, `@${service.url}`)}`);
    console.log(error);
  });
}
