# Change Log

This is a log of all major changes to [CONNECT platform](https://connect-platform.github.io/connect-platform/).

The format is inspired by [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and we use [Semantic Versioning](http://semver.org/spec/v2.0.0.html), like strictly.

## [Unreleased]
### Added
 - support for seeing shell logs in test/watch mode.
 - support for timeouts in test/watch mode.
 - a new `error` function for native nodes to properly indicate error states.
 - some more standard keyboard shortcuts:
   - Ctrl+S (Cmd+S) for saving.
   - Del (Backspace) for deleting.
### Changed
 - more verbose logging when failing to load packages.
 - more robust error handling (less errors now escape the recorder's grasp).
 - expressions now have an 'expanded' view to increase coding space within them.

## [0.2.5] - 2018-08-30
### Added
 - **InterCONNECT** feature:
   - you can now inter-CONNECT with other CONNECT-based micro-services. you simply give them a name and add their url and their public nodes will be accessible in your instance.
 - support for installing packages from sources other than NPM (namely Git).
 - project names (stored in config)
 - logout (when logged in via an access token)
 - support for setup documentation on installed external packages.
 - support for closing panel overlay's using escape key.
### Changed
 - extracted firestore as a separate independently published package.
 - extracted mongodb as a separate independently published package.
 - panel now does not allow to create incompatible links.

## [0.2.3] - 2018-07-23
### Added
 - optional panel token authentication.
 - in-panel configuration of project.
 - in-panel installation of packages.
  - also support for adding any npm package.
 - node documentation (nodes can have documentation so that people can easily use them).
### Changed
 - one registry object will be created in case there are multiple versions of platform installed.
 - one platform instance will be created in case there are multiple versions of platform installed.
 - one instance of platform dependency map for external packages will be created in case there are
    multiple versions of platform installed.

## [0.1.3] - 2018-06-20
### Added
 - Change Log, obviously.
 - **Watch** feature:
   - you can now **Watch** your nodes in response to real invocations, which is when they are called by other nodes or, if they are public, they are invoked by a request directly.
   - basically, when you start **Watch**-ing your node, the first invocation of that path will be recorded with the given inputs of the invocation.
   - I expect this becomes specially handy in testing client-server connections and web-hooks.
 - you can debug errors using the **Test** feature:
   - errors are now recorded events like other flow events.
   - when an error occurs during execution of a sub-node of the node being tested, the recording will end, the node causing the error will be highlighted in red and also the cause will be displayed. clicking on the node will also a full stack trace.

## [0.1.2] - ~2018-05-20
### Added
 - **Test** feature:
   - you can run a node via the panel, and see a detailed recording of its execution visually on the logical flow graph.
   - you will be asked to give proper input values if the node requires some inputs.
   - there is a nice client-side player for watching these recordings, which is like a video player but also highlights events on the timeline which should be useful in performance analysis.
   - you can see exact timing of all events, the node activation periods, data that is being passed on the connections of the nodes, etc, etc.
   - what I am trying to say is, it is really beautiful.

## [0.1.1] - ~2018-04-20
### Added
 - readme and [guides on medium](https://medium.com/connect-platform/guides/home)
 - a nice utility node named `#iterate` for iterating over arrays, now that looping is allowed.
### Changed
 - looping is now allowed.

## [0.1.0] - ~2018-04-15
### Added
 - a nice [NPM package](https://www.npmjs.com/package/connect-platform/). this of course required tweaks to the code of the panel to be nicely shippable.
