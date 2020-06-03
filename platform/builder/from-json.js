const { Recipe } = require('./recipe');
const { NotFound } = require('./errors');


const handleInput = (_in, r) => r.add(c => c.addInput(_in));
const handleOutput = (_out, r) => r.add(c => c.addOutput(_out));
const handleControl = (_control, r) => r.add(c => c.addOutput(_control, true));
const handleConfig = (_config, r) => r.add(c => c.addConfig(_config));

const handleNode = (_node, r) => {
  if (_node.expr && _node.in) r.add(c => c.addExpr(_node.tag, _node.in, _node.expr));
  else if (_node.expr) r.add(c => c.addValue(_node.tag, _node.expr));
  else if (_node.cases) r.add(c => c.addSwitch(_node.tag, _node.cases));
  else if (_node.path) r.add(c => c.addCall(_node.tag, _node.path, _node.key));
}

const handleLink = (_link, r) => {
  if (_link[0] instanceof Array) {
    for (let a of _link[0])
      handleLink([a, _link[1]], r);
  }
  else if (_link[1] instanceof Array) {
    for (let b of _link[1])
      handleLink([_link[0], b], r);
  }
  else {
    r.add(c => findPin(_link[0], c).connect(findPin(_link[1], c)));
  }
}

const findPin = (desc, c) => {
  if (typeof desc === 'string')
    return c.node(desc).pins.control;

  let tag = Object.keys(desc)[0];
  let body = desc[tag];

  if (tag == 'in') {
    if (!(body in c.inputs)) throw new NotFound(`input pin ${body}`);
    return c.inputs[body];
  }

  if (tag == 'out') {
    if (!(body in c.outputs)) throw new NotFound(`output pin ${body}`);
    return c.outputs[body];
  }

  if (tag == 'config') {
    if (!(body in c.configs)) throw new NotFound(`config pin ${body}`);
    return c.configs[body];
  }

  let node = c.node(tag);
  if (body == 'target') {
    if (!('target' in node.pins)) throw new NotFound(`pin target of node ${tag}`);
    return node.pins.target;
  }

  if (body == 'result') {
    if (!('result' in node.pins)) throw new NotFound(`pin result of node ${tag}`);
    return node.pins.result;
  }

  if (body.in) {
    if (!(body.in in node.pins.in)) throw new NotFound(`input pin ${body.in} of node ${tag}`);
    return node.pins.in[body.in];
  }

  if (body.out) {
    if (!(body.out in node.pins.out)) throw new NotFound(`output pin ${body.out} of node ${tag}`);
    return node.pins.out[body.out];
  }

  if (body.control) {
    if (!(body.control in node.pins.controlOut)) throw new NotFound(`control output pin ${body.control} of node ${tag}`);
    return node.pins.controlOut[body.control];
  }

  if (body.case) {
    if (!(body.case in node.pins.cases))
      throw new NotFound(`case pin "${body.case}" of node ${tag}`);
    return node.pins.cases[body.case];
  }

  throw new NotFound(`pin described as ${desc}.`);
};

const fromJSON = json => {
  let recipe = new Recipe();
  let desc = json;
  if (typeof(json) === 'string')
    desc = JSON.parse(json);

  if (desc.path) recipe.signature.path = desc.path;
  if (desc.description) recipe.signature.description = desc.description;
  if (desc.public) recipe.signature.public = desc.public;
  if (desc.socket) recipe.signature.socket = desc.socket;
  if (desc.method) recipe.signature.method = desc.method.toLowerCase();
  if (desc.key) recipe.signature.key = desc.key;

  if (desc.in) {
    recipe.signature.inputs = desc.in;
    for (let _in of desc.in) handleInput(_in, recipe);
  }

  if (desc.out) {
    recipe.signature.outputs = desc.out;
    for (let out of desc.out) handleOutput(out, recipe);
  }

  if (desc.control) {
    recipe.signature.controlOutputs = desc.control;
    for (let control of desc.control) handleControl(control, recipe);
  }

  if (desc.configs) for (let config of desc.configs) handleConfig(config, recipe);
  if (desc.nodes) for (let node of desc.nodes) handleNode(node, recipe);
  if (desc.links) for (let link of desc.links) handleLink(link, recipe);

  return recipe;
};

module.exports = fromJSON;
