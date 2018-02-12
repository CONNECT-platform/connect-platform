const { PinEvents } = require('./base/pin');
const { IOPinEvents } = require('./base/io');
const { Node, NodeEvents } = require('./base/node');
const { Expression } = require('./expression');
const { Switch } = require('./switch');
const { Call } = require('./call');

const node = require('./node');
const callable = require('./callable');
const registry = require('./registry');

module.exports = {
  Events: {
    pin: PinEvents,
    io: IOPinEvents,
    node: NodeEvents,
  },

  Node: Node,
  Expression: Expression,
  Switch: Switch,
  Call: Call,

  node: node,
  callable: callable,
  registry: registry,
}
