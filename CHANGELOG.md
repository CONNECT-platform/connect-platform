# Change Log

This is a log of all major changes to [CONNECT platform](https://connect-platform.com).

The format is inspired by [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and we use [Semantic Versioning](http://semver.org/spec/v2.0.0.html), like strictly.

**NOTE**: there is not an entry for every version. Some versions included super minor changes, and as a result were excluded from this change log. For a really detailed history of changes, please checkout the commit history of the project.

## [Unreleased]
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
