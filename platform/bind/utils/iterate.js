const platform = require('../../');


platform.core.node({
  path : '#iterate',
  public : false,
  inputs : ['target'],
  outputs : ['step'],
  controlOutputs : ['finished']
}, (inputs, output, control) => {
  if (inputs.target.__iteration_step) {
    if (inputs.target.last)
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
        last: false,
        item: inputs.target[0],
      });
    }
    else control('finished');
  }
});
