<p align="center">  
  <img src="assets/logo-std.svg?sanitize=true" width="300px"/>
</p>

**CONNECT platform**  is a visual backend development platform aiming to speed up development of async logical microservices (like drastically). The core idea is that async logic is inherently a "Graph" and a representation via a "Chain" (i.e. text-based code) is extremely sub-optimal (so yes the "visuality" is not for non-programmers to be able to play around).

Since not all parts of a microservice logic are necessarily async, **CONNECT** facilitates injecting sync pieces of code on the fly. However, since sync code is more computationally focused, it is probably less specific to the business logic of the microservice and more a general algorithm, hence probably the best place for it is at the lowest layers in the architecture. So generally it is advisable to attach sync code in form of `packages`.

* https://connect-platform.com
* https://medium.com/connect-platform/guides/home

## how to setup

- easy way with docker: 
  - create a folder, `cd` to it,
  - run this:
```bash
docker run -dit \
          --name connect-platform \
          -p 4000:4000 \
          -v $(pwd)/panel-generated:/app/panel-generated \
          -v $(pwd)/secure:/app/secure \
          --env CONNECT_INSTALL_EXTERNAL_PACKAGES=true \
          loreanvictor/connect-platform
```
- easy way without docker: https://github.com/CONNECT-platform/connect-platform-boilerplate
- easy way for developing a package: https://github.com/CONNECT-platform/connect-platform-package-boilerplate
- more comprehensive setup: https://medium.com/connect-platform/how-to-setup-connect-platform-d82d49e029ee

## how to contribute

take a look [here](CONTRIBUTING.md).

[![Build Status](https://travis-ci.org/loreanvictor/connect-platform.svg?branch=master)](https://travis-ci.org/loreanvictor/connect-platform)
