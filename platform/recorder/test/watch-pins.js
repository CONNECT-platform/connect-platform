const should = require('chai').should();

const watch = require('../watch');
const core = require('../../core');


describe('watch() for pins', () => {
  it('should watch receive events on input pins', done => {
    let pin = new core.pins.InputPin();

    watch(pin).watched(event => {
      if (event.event == core.events.io.receive) {
        event.data.should.equal('hellow');
        done();
      }
    });

    pin.receive('hellow');
  });

  it('should watch send events on output pins', done => {
    let pin = new core.pins.OutputPin();

    watch(pin).watched(event => {
      if (event.event == core.events.io.send) {
        event.data.should.equal('world');
        done();
      }
    });

    pin.send('world');
  });

  it('should watch activate event on controller pins', done => {
    let pin = new core.pins.ControllerPin();

    watch(pin).watched(event => {
      if (event.event == core.events.pin.activate)
        done();
    });

    pin.activate();
  });

  it('should watch activation of control pins', done => {
    let pin = new core.pins.ControlPin();
    let controller = new core.pins.ControllerPin();
    pin.connect(controller);

    watch(pin).watched(event => {
      if (event.event == core.events.pin.activate)
        done();
    });

    controller.activate();
  });
});
