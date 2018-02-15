const { Recipe } = require('./recipe');


const handleInput = (_in, r) => r.add(c => c.addInput(_in));
const handleOutput = (_out, r) => r.add(c => c.addOutput(_out));
const handleControl = (_control, r) => r.add(c => c.addOutput(_contro, true));
const handleConfig = (_config, r) => r.add(c.addConfig(_config));

const handleNode = (_node, r) => {
  if (_node.expr && _node.in) r.add(c => c.addExpr(_node.tag, _node.in, _node.expr));
  else if (_node.expr) r.add(c => c.addValue(_node.tag, _node.expr));
  else if (_node.cases) r.add(c => c.addSwitch(_node.tag, _node.cases));
  else if (_node.path) r.add(c => c.addCall(_node.tag, _node.path));
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

  if (tag == 'in') return c.inputs[body];
  if (tag == 'out') return c.outputs[body];
  if (tag == 'config') return c.configs[body];

  let node = c.node(tag);
  if (body == 'target') return node.pins.target;
  if (body == 'result') return node.pins.result;
  if (body.in) return node.pins.in[body.in];
  if (body.out) return node.pins.out[body.out];
  if (body.case) return node.pins.cases[body.cases];
};

const fromJSON = json => {
  let recipe = new Recipe();
  let desc = JSON.parse(json);

  recipe.add(c => {
    if (desc.path) c.meta.path = desc.path;
    if (desc.description) c.meta.description = desc.description;
    if (desc.public) c.meta.public = desc.public;
  });

  for (let _in of desc.in) handleInput(_in, recipe);
  for (let out of desc.out) handleOutput(out, recipe);
  for (let control of desc.control) handleControl(control, recipe);
  for (let config of desc.configs) handleConfig(config, recipe);
  for (let node of desc.nodes) handleNode(node, recipe);
  for (let link of desc.links) handleLink(node, recipe);

  return recipe;
};

module.exports = fromJSON;
