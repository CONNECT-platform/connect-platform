const SocketIO = require('socket.io');
const Routes = require('../common/routes');
const axios = require('axios');
const core = require('../../core');

const socketRoutes = new Routes(core.registry, 'socket');

const { hashSig } = require('../../util/hash');

const { Sockets } = require('./Sockets');

module.exports = (server) => {
  const platform = global.connect_platform_instance;
  const io = SocketIO(server);
  const sockets = new Sockets();

  let config = platform.config.get("socket_config") || {};
  let prefix = config["event-prefix"] || "";
  let pathMap = config["event-map"] || {};

  if(config.use_redis) {
    const redis = require('redis');
    const redisAdapter = require('socket.io-redis');

    let sub = null;
    let pub = null;

    if(config.redis_pub) {
      pub = redis.createClient(config.redis_pub);
    }

    if(config.redis_sub) {
      sub = redis.createClient(config.redis_sub);
    }

    if(!pub && config.redis) {
      pub = redis.createClient(config.redis);
    }

    if(!sub && config.redis) {
      sub = redis.createClient(config.redis);
    }

    if(! pub || ! sub) {
      console.error('The use_redis flag is on but redis or redis_pub and redis_sub are not set');
    }

    io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
  }

  io.on('connection', (socket) => {
    sockets.add(socket);

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

        return platform.core.callable(() => platform.core.registry.instance(signature.path, signature.key), {
            socket
          })(inputs)
          .catch((err) => {
            socket.emit('call_error', err);
            throw err;
          });
      } else {
        socket.emit('call_error', { status: 404 });
        return Promise.reject("Cannot find socket node for path " + fullPath);
      }
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
      .then(() => sockets.remove(socket))
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

  return { io, sockets };
}