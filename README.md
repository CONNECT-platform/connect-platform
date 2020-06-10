<p align="center">  
  <img src="assets/logo-std.svg?sanitize=true" width="300px"/>
</p>
 
<p>
  <a class="btn btn-large btn-purple" href="https://connect-platform.com/connect/" role="button">HIRE CONNECT DEVELOPERS</a>
</p>

**CONNECT platform**  is a graphical backend development platform aiming to speed up development of async logical microservices (like drastically). The core idea is that async logic is inherently a "Graph" and a representation via a "Chain" (i.e. text-based code) is extremely sub-optimal (so yes the "visuality" is not for non-programmers to be able to play around).

Since not all parts of a microservice logic are necessarily async, **CONNECT** facilitates injecting sync pieces of code on the fly. However, since sync code is more computationally focused, it is probably less specific to the business logic of the microservice and more a general algorithm, hence probably the best place for it is at the lowest layers in the architecture. So generally it is advisable to attach sync code in form of `packages`.

🚀  Platform to use: https://connect-platform.com/connect/

📗  Documentation: https://medium.com/connect-platform/guides/home

🎬  Video (Change the world and stuff): https://www.youtube.com/watch?v=Orjtawd7_EU

🐦  Twitter (@CONNECT_pltfrm): https://twitter.com/connect_pltfrm

💬  Discord Community: https://discord.gg/z22kZh





## How to setup 📋

▶️easy way with docker: 
  - create a folder, `cd` to it,
  - run this:
```bash
docker run -dit \
          --name connect-platform \
          -p 4000:4000 \
          -v $(pwd)/panel-generated:/app/panel-generated \
          -v $(pwd)/secure:/app/secure \
          --env CONNECT_INSTALL_EXTERNAL_PACKAGES=true \
          --env CONNECT_REMOTE_SHELL_ENABLED=true \
          loreanvictor/connect-platform
```
▶️easy way without docker: https://github.com/CONNECT-platform/connect-platform-boilerplate
 
▶️easy way for developing a package: https://github.com/CONNECT-platform/connect-platform-package-boilerplate

▶️more comprehensive setup: https://medium.com/connect-platform/how-to-setup-connect-platform-d82d49e029ee 


## How to configure

You can set config values directly from environment variables using a simple (and probably familiar) templating language. You can just specify the value in curly braces as folllows `"{{ ENV_VAR || default_value }}"`.

It is also possible to specify a request size limit through the `request_limit` config property.

Socket support is enabled through the `enable_sockets` property. Socket.io support can be further configured through the `socket_config` config object. `socket_config.use_redis` activates support for redis for which `socket_config.redis` or `socket_config.redis_pub` and `socket_config.redis_sub` have to be specified to configure the redis connection for the pub/sub support (can be empty objects). Further information on how to use the `socket.io-redis` package can be found [here](https://www.npmjs.com/package/socket.io-redis).

An example configuration is shown below for reference.
```json
{
  "config_from_env": "{{ CONNECT_CONFIG_FROM_ENV || default }} ",
  "request_limit": "100mb",
  "enable_sockets": true,
  "socket_config": {
    "use_redis": true,
    "redis": {},
    "redis_pub": {},
    "redis_sub": {}
  }
}
```

Environment variables that are already loaded by the provided launch script are shown in the following table.

| Variable Name           | What it does?                           |
|---                      |---                                      |
| CONNECT_PRODUCTION_MODE | Run CONNECT platform in production mode |
| CONNECT_ENABLE_SOCKET   | Enable socket.io support                |


## How to contribute
 
Take a look [here](CONTRIBUTING.md).

[![Build Status](https://travis-ci.org/loreanvictor/connect-platform.svg?branch=master)](https://travis-ci.org/loreanvictor/connect-platform) 