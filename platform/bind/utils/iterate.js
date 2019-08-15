const platform = require('../../');


platform.core.node({
  path : '#iterate',
  public : false,
  inputs : ['target'],
  outputs : ['step'],
  controlOutputs : ['finished'],
  hints: {
    node: 'iterates on the given list (or other iterable object). '+
          'pass a list (or other iterables) to the <span class="hl-blue">target</span> input, '+
          'and pass the result of <span class="hl-blue">step</span> output back to the <span class="hl-blue">target</span> input.'+
          'make sure to add a control mechanism in that loop, as otherwise it would be an infinite loop.',
    inputs: {
      target: 'a list (or other iterable object) for initializing iteration, or '+
          ' the <span class="hl-blue">step</span> object created by this node for '+
          'continuation of the iteration.'
    },
    outputs: {
      step: 'a step object holding the state of the iteration. you should pass it back '+
          'to the <span class="hl-blue">target</span> input of this node for continuation of the iteration.'
    },
    controlOutputs: {
      finished: 'will activate when the iteration is finished.'
    }
  }
}, (inputs, output, control) => {
  if (inputs.target.__iteration_step) {
    if (inputs.target.last || inputs.target.index >= inputs.target.target.length - 1)
      control('finished');
    else {
      inputs.target.index++;
      inputs.target.first = false;
      inputs.target.last = inputs.target.index >= inputs.target.target.length - 1;
      inputs.target.item = inputs.target.target[inputs.target.index];
      output('step', inputs.target);
    }
  }
  else {
    if (inputs.target.length > 0) {
      output('step', {
        __iteration_step: true,
        index: 0,
        target: inputs.target,
        first: true,
        last: inputs.target.length == 1,
        item: inputs.target[0],
      });
    }
    else control('finished');
  }
});
