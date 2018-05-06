const core = require('../core');
const { Composition } = require('../builder/composition');

const { WatcherEvents, Watcher } = require('./watcher');
const { CompositeWatcher } = require('./composite-watcher');


const watch = subject => {
  if (subject instanceof core.pins.InputPin ||
      subject instanceof core.pins.OutputPin) {
    return new Watcher(core.events.io).watch(subject);
  }

  if (subject instanceof core.pins.ControlPin ||
      subject instanceof core.pins.ControllerPin) {
    return new Watcher([core.events.pin.activate]).watch(subject);
  }

  if (subject instanceof core.Node) {
    let inputWatcher = new CompositeWatcher();
    Object.entries(subject.pins.in)
          .forEach(([name, pin]) => inputWatcher.mount(name, watch(pin)));

    let outputWatcher = new CompositeWatcher();
    Object.entries(subject.pins.out)
          .forEach(([name, pin]) => outputWatcher.mount(name, watch(pin)));

    let controlOutWatcher = new CompositeWatcher();
    Object.entries(subject.pins.controlOut)
          .forEach(([name, pin]) => controlOutWatcher.mount(name, watch(pin)));

    return new CompositeWatcher(core.events.node).watch(subject)
          .mount('in', inputWatcher)
          .mount('out', outputWatcher)
          .mount('controlOut', controlOutWatcher)
          .mount('control', watch(subject.pins.control))
          ;
  }

  if (subject instanceof Composition) {
    let inputWatcher = new CompositeWatcher();
    Object.entries(subject.inputs)
          .forEach(([name, pin]) => inputWatcher.mount(name, watch(pin)));

    let configWatcher = new CompositeWatcher();
    Object.entries(subject.configs)
          .forEach(([name, pin]) => configWatcher.mount(name, watch(pin)));

    let outputWatcher = new CompositeWatcher();
    Object.entries(subject.outputs)
          .forEach(([name, pin]) => outputWatcher.mount(name, watch(pin)));

    let nodeWatcher = new CompositeWatcher();
    Object.entries(subject.nodes)
          .forEach(([name, node]) => nodeWatcher.mount(name, watch(node)));

    return new CompositeWatcher()
          .mount('in', inputWatcher)
          .mount('conf', configWatcher)
          .mount('out', outputWatcher)
          .mount('node', nodeWatcher)
          ;
  }
}

module.exports = watch;
