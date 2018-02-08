class Node {
  constructor(inputs, outputs) {
    this._inputLinks = {};
    this._outputLinks = {};
    this._controlLinks = [];

    if (inputs)
      for (var input of inputs)
        this._inputLinks[input] = undefined;

    if (outputs)
      for (var output of outputs)
        this._outputLinks[output] = [];
  }

  connectInput(input, link) {
    if (input in this._inputLinks) {
      if(!this._inputLinks[input]) {
        this._inputLinks[input] = link;
        link.connectTo(this);
      }
    }
  }

  connectOutput(output, link) {
    if (output in this._outputLinks) {
      this._outputLinks[output].push(link);
      link.connectFrom(this);
    }
  }

  connectControl(link) {
    this._controlLinks.push(link);
    link.connectTo(this);
  }

  disconnectInput(input) {
    if (input in this._inputLinks) {
      this._inputLinks[input].disconnectTo();
      this._inputLinks[input] = undefined;
    }
  }

  disconnectOutput(output, link) {
    if (output in this._outputLinks) {
      this._outputLinks[output] = this._outputLinks[output].filter(l => l != link);
      link.disconnectFrom();
    }
  }

  disconnectControl(link) {
    this._controlLinks = this._controlLinks.filter(l => l != link);
    link.disconnectTo();
  }

  get inputs() {
    return Object.keys(this._inputLinks);
  }

  get outputs() {
    return Object.keys(this._outputLinks);
  }

  get signature() {
    return {
      inputs: this.inputs,
      outputs: this.outputs,
    }
  }

  get incoming() {
    return Object.values(this._inputLinks).concat(this._controlLinks);
  }

  get outbound() {
    var res = [];
    for (var links of Object.values(this._outputLinks))
      res = res.concat(links);
    return res;
  }

  get canActivate() {
    for (var link of this.incoming)
      if (!link || !link.active) return false;

    return true;
  }

  checkActivate() {
    if (this.canActivate) {
      return new Promise(resolve => {
        var inputs = {};
        for (var [input, link] of Object.entries(this._inputLinks))
          inputs[input] = link.data;

        this.run(inputs, (output, data) => {
          if (output in this._outputLinks) {
            resolve({
              output: output,
              data: data,
            });
          }
        });
      }).then(response => {
        for (var link of this._outputLinks[response.output])
          link.activate(response.data);
      });
    }
  }

  run(inputs, respond) {}
}

module.exports = Node;
