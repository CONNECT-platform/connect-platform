# Change Log

This is a log of all major changes to [CONNECT platform](https://connect-platform.com).

The format is inspired by [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and we use [Semantic Versioning](http://semver.org/spec/v2.0.0.html), like strictly.

**NOTE**: there is not an entry for every version. Some versions included super minor changes, and as a result were excluded from this change log. For a really detailed history of changes, please checkout the commit history of the project.

## [0.3.8] - 2020-06-30
### Fixed:
- Fix potential errors when unknown types are used with expressions which can lead to hashing errors.


## [0.3.7] - 2020-06-17
### Fixed:
 - Fix a bug affecting context cashing for expressions as it only relied on the keys rather than the values this leads to context values being changed mid logic.

## [0.3.6] - 2020-06-17
### Fixed:
 - Fix removal of a socket from Sockets object only after disconnect is called to give the called node a change to access that data.

## [0.3.4] - 2020-06-10
### Added:
 - Added support for `socket.io-redis` for pub/sub.

## [0.3.3] - 2020-06-08
### Fixed:
 - Fix bug where folderization of the node list fails at the second level.

## [0.3.2] - 2020-06-03
### Fixed:
 - Fix bug where changing nodes paths can result in the old path persisting in the path-map file.
 - Fix bug where new nodes weren't being saved to the index.
 - Fix UI bug when changing between node types. The default method 'GET' now is chosen as the default.

## [0.3.1] - 2020-06-03
### Fixed:
 - Fix bug where picking a call card on the UI doesn't open the right URL/id combination.

## [0.3.0] - 2020-06-03
### Added:
 - Support for multi-type same path nodes.
 - UI support for multi-type nodes when specifying a call.
 - A key mechanism to distiniush between nodes based on the path, if they are public or not (the method if applicable) and if it's a socket node.
 - A more extensive test suite.

## [0.2.32] - 2020-05-22
### Added:
 - Added default values support for the `autoparseFromEnvironmentVars` method example of usage: `{{ ENV_VARIABLE || default }}`.
### Fixed:
 - Fixed bug where call to the api endpoint result in an error.

## [0.2.31] - 2020-05-20
### Fixed:
 - Fixed bug with the `autoparseFromEnvironmentVars` method where a non existing environment variable would lead to an infinite loop.

## [0.2.30] - 2020-05-19
### Added:
 - Added debug mode to the `autoparseFromEnvironmentVars` method.

## [0.2.29] - 2020-05-19
### Added:
 - Added `autoparseFromEnvironmentVars` method to autoparse config from envrionment variables with a templating language based approach.

## [0.2.28] - 2020-05-18
### Added:
 - Added `setFromEnvVariable` on the config object which now allows you to set config path values (dot notation) from environment variables.
 - Added `setServiceURLFromEnvVariable` on the config object which now allows you to set service URLs from  environment variables.

## [0.2.26] - 2020-05-18
### Added:
 - Added `enable_sockets` config flag where you can now specify if webscokets should be enabled through Socket.io.
 - The `enable_sockets` config flag can also be set through the `CONNECT_ENABLE_SOCKET` environment variable.
 - Routes class which relies on publish events to construct a public routes repo.
### Changed:
 - Refactored `getPublicRoutes` into the Routes class.
 - Added more tests.

## [0.2.25] - 2020-05-05
### Fixed:
 - Added `request_limit` config flag where you can now specify the limit on the request body size.

## [0.2.24] - 2020-05-02
### Fixed:
 - Root path `/` now works properly when defined and called.

## [0.2.23] - 2020-05-02
### Added:
 - Support for multiple Http methods on endnpoints with the same name.
 - Updates to core and panel dependencies (fixes all security vulnerabilities detected by npm).
 - Panel can now be hidden directly through an envrionment variable `CONNECT_PANEL_HIDE=true`.

## [0.2.17] - 2019-05-30
### Added:
 - remote shell access: now you can access a remote shell of the system the platform is running on via web. 
   - this needs to be enabled either via the panel `"remote-shell": { "enabled": true }` or by the environment variable `CONNECT_REMOTE_SHELL_ENABLED=true`.
   - this requires _ttyd_ to be installed on the system.
   - this is mostly intended for the docker image and containers running based on that image, as in other environments the user already has access to a shell. this is configured on the default docker image and is enabled by default, though it can be turned off via aforementioned configuration.
### Changed:
 - fixed a bug that made adding switches impossible.

## [0.2.15] - 2019-05-27
### Added:
 - command palette: now you can do a lot of stuff with keyboard only using the command palette, accessible via `CMD|Ctrl + Enter` hotkey.
   - you can also directly access the "Insert" command palette using `CMD|Ctrl + I` hotkey.
 - drag interaction for connecting pins (alongside the usual click-to-begin,click-to-end).
 - added remove buttons to inputs, configs, outputs, control outputs, etc. for easier deletion.
### Changed:
 - removed the restriction of connecting pins that allowed only starting from output or control pins.

## [0.2.14] - 2019-05-22
### Added:
 - copy button on each console entry (so you can easily copy each line).
 - messages guiding people to the guides, alongside a button for that to home header.
### Changed:
 - nodes are now organized in folders when they start with the same path.
 - fixed a bug on authentication.

## [0.2.12] - 2019-01-10
### Added
 - diving: 
   - double click on calls to other nodes made with the panel would open the new node in another tab.
   - this only works for nodes created with the panel.
 - import/export:
   - you can now export each node to a json file (left-hand menu in editor, misc -> export).
   - you can now import the exported node json files in the editor.
 - multiselect:
   - now you can pick multiple nodes/links and move them around using `Shift` key.
   - you can deselect a few items from your selection using `Ctlr | CMD` key.
   - you can also select multiple items at once by drag-selecting (also add a handful while holding `Shift` key or remove a few holding `Ctrl | CMD` key).
   - now you can delete multple nodes/links.
   - now you can also highlight the events of multiple nodes/links in test mode by selecting them.
   - now you can copy/cut/paste a selected subgraph, also into other open tabs, both using UI buttons and standard `Ctrl|CMD + C|X|V` shortcuts.
 - auto-naming:
   - when connecting a link between a yet-unlabeled pin and a labeled pin, the unlabeled pin will automatically assume the label of the other side of the link.
   - the label will be converted to match an underscore-based proper JS variable name.
   - cases of `Switch` nodes are ignored.
 - config:
   - now you can set `production` config, which will be stored in a separate file and can be utilized in production environment only.
   - you can now write a configuration script, which is a Javscript snippet that will get executed at instance startup.
### Changed
 - fixed a bug related to watching multiple nodes at the same time.
 - added some autofocus on inputs and code editors for QoL.
 - changed the shortcut for next and prev events on test/watch mode from `Shift + Left|Right` to `Left|Right`.
 - differentiated the way nodes and links while selected vs while they are active (in test mode).
 - optimized the renderer to get smoother animations with better frame rates.
 - made the platform completely trailing slash agnostic:
   - for each node with a trailing slash, an alias without will be registered automatically.
   - for each node without a trailing slash, an alias with will be registered automatically.
   - the panel by default drops the one with the trailing slash.
   - you can currently override this behaviour by mapping the alias to another node. this is however not recommended and the ability to do so might be removed in near future.

## [0.2.10] - 2018-11-20
### Added
 - shared context:
   - now there is an shared object between all nodes on the call chain of the response to the same web request.
   - the object is called `context` and is referencable either as a new class member `context` on `Node` subclasses, as a fifth function parameter on native nodes defined using the `node` function, or with the name `context` in values and expressions.
   - the `context` object also carries the express request and response objects in form of `context.req` and `context.res`.
 - buttons for seeking to next and previous events on the timeline.
 - you can now mark public nodes for being excluded from interconnectible registry.
### Changed
 - exapnded value/expression functionality:
   - if you write a function inside a value/expr which takes no arguments, the function will be executed and its result will be the output of the expression (so no more need for self-enclosing functions).
   - if you write a function with exactly one argument inside a value/expr, the function will be executed with the argument passed being a callback function for returning the value of the expression. this is to enable inline async coding in JS in a node.
   - the node's `error` function alongside the nodejs `require` function are now passed to expr/value execution context.
 - 'expanded' mode update:
   - 'expanded' mode on expressions now opens a full page editor.
   - values now also have an 'expanded' mode.
 - the interconnect now by default assumes `http://` as protocol if it's not provided with one.
 - panel's save node now also requires proper `connect_token` header to function.
 - the shift + left|right shortcut on the debugger's timeline jumps to previous/next events.
 - fixed a bug in which you needed to press the "play" button twice if the node required inputs for testing.

## [0.2.6] - 2018-10-15
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
