const base = require('./base');
const ObservableLink = require('./observable-link');


const callable = nodeFactory => {
  return inputs => {
    return new Promise(resolve => {
      inputs = inputs || {};
      let node = nodeFactory();

      for (var input of node.inputs) {
        let link = new base.Link();
        node.connectInput(input, link);
        link.activate(inputs[input]);
      }

      for (let output of node.outputs) {
        let link = new ObservableLink().subscribe(data => {
          let res = {};
          if (data == undefined) res[output] = true;
          else res[output] = data;

          resolve(res);
        });
        node.connectOutput(output, link);
      }

      node.checkActivate();
    });
  }
}

module.exports = callable;
