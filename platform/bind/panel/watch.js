const path = require('path');

const platform = require('../../');
const config = require('./util/config');
const record = require('../../recorder');

const purify = require('./util/purify-recording');


watchlist = {};

platform.core.node({
  path : `${config.path}watch`,
  public : config.expose,
  method : 'POST',
  inputs : ['model', 'timelimit'],
  controlOutputs : ['done', 'no_path'],
}, (inputs, output, control) => {
  if (!inputs.model.path) control('no_path');
  else {
    let model = inputs.model;
    let timelimit = inputs.timelimit;
    delete watchlist[model.path];

    platform.core.registry.mock(model.path, class extends platform.core.Node {
      constructor(){
        super({
          inputs: model.in,
          outputs: model.out,
          controlOutputs: model.control,
        });
      }

      run(inputs, output, control) {
        platform.core.registry.unmock(model.path);
        record(model, inputs, platform.config.core, timelimit, this.context)
          .then(recording => {
            watchlist[model.path] = recording;

            let error = true;
            recording.forEach(record => {
              if (record.event.tag == 'out') {
                if (model.out.includes(record.event.cascaded.tag)) {
                  error = false;
                  output(record.event.cascaded.tag, record.event.cascaded.cascaded.data);
                }
                else if (model.control.includes(record.event.cascaded.tag)) {
                  error = false;
                  control(record.event.cascaded.tag);
                }
              }
            });

            if (error) this.error('');
          });
      }
    });
    control('done');
  }
});

platform.core.node({
  path : `${config.path}watch/result`,
  public : config.expose,
  method : 'GET',
  inputs : ['path'],
  outputs: ['recording'],
  controlOutputs : ['not_watched'],
}, (inputs, output, control) => {
  if (inputs.path in watchlist) {
    output('recording', purify(watchlist[inputs.path]));
  }
  else control('not_watched');
});
