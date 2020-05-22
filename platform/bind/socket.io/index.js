const SocketIO = require('socket.io');
const Routes = require('../common/routes');
const axios = require('axios');
const core = require('../../core');

const socketRoutes = new Routes(core.registry, 'socket');

module.exports = (server) => {
  const platform = global.connect_platform_instance;
  const io = SocketIO(server);

  let config = platform.config.get("socket-config") || {};
  let prefix = config["event-prefix"] || "";
  let pathMap = config["event-map"] || {};

  io.on('connection', (socket) => {
    // helper function to build the inputs object and call a node
    let callNode = (path, params = {}) => {
      let nodes = socketRoutes.get();
      let fullPath = prefix + (pathMap[path] || path);

      let signature = socketRoutes.find(fullPath);
      
      if (signature) {
        let inputs = {};
        if (signature.inputs) {
          for (let input of signature.inputs) {
            if (params[input]) inputs[input] = params[input]
          }
        }

        // create a callable from the node instance and set the socket as context
        return platform.core.callable(() => platform.core.registry.instance(signature.path, signature.method), {
          socket
        })(inputs)
      } else
        return Promise.reject("Cannot find socket node for path " + fullPath);
    }

    callNode("connect", {
      id: socket.id
    })
    .catch(err => console.warn(err))

    // optional node executed on disconnect
    // must have the 'on-socket-disconnect' config parameter set to a node path
    socket.on("disconnect", () => {
      callNode("disconnect", {
        id: socket.id
      })
      .catch(err => console.warn(err))
    })

    socket.use((packet) => {
      /*
          packet must be array of three parameters:
          1. node path: string
          2. input parameters: object
          3. result callback url: string
      */

      if (typeof packet[0] != 'string')
        return;

      let callback = packet[2];

      callNode(packet[0], packet[1])
        .then(result => {
          if(typeof callback !== 'string' && ! (callback instanceof String) ) return;

          let params = {};
          if(result.output) {
            params[result.output] = result.data;
          } else if(result.control) {
            params.control = result.control;
          }

          axios.post(callback, params).then((res) => {
            console.log(`Callback ${callback} result data: ${JSON.stringify(res.data)}`);
          });
        });
    });
  });

  return io;
}