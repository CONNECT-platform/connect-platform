const { PinEvents } = require('./base/pin');
const { InputPin, OutputPin, IOPinEvents } = require('./base/io');
const { ControlPin, ControllerPin } = require('./base/control');
const { Node, NodeEvents } = require('./base/node');
const { Expression } = require('./expression');
const { Switch } = require('./switch');
const { Call } = require('./call');

const node = require('./node');
const callable = require('./callable');
const registry = require('./registry');

module.exports = {
  events: {
    pin: PinEvents,
    io: IOPinEvents,
    node: NodeEvents,
  },

  pins: {
    InputPin: InputPin,
    OutputPin: OutputPin,
    ControlPin: ControlPin,
    ControllerPin: ControllerPin,
  },

  Node: Node,
  Expression: Expression,
  Switch: Switch,
  Call: Call,

  node: node,
  callable: callable,
  registry: registry,
}
