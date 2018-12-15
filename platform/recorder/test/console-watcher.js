const should = require('chai').should();

const { Watcher, WatcherEvents } = require('../watcher');
const { ConsoleWatcher, ConsoleEvents } = require('../console-watcher');


describe('ConsoleWatcher', () => {
  it('should watch console logs.', done => {
    let watcher = new ConsoleWatcher();

    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.log);
      event.data.should.equal('a log');

      watcher.unhook(console);
      done();
    });

    console.log('a log');
  });

  it('should watch console errors.', done => {
    let watcher = new ConsoleWatcher();

    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.error);
      event.data.should.equal('an error');

      watcher.unhook(console);
      done();
    });

    console.error('an error');
  });

  it('should watch console warnings.', done => {
    let watcher = new ConsoleWatcher();
    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.warn);
      event.data.should.equal('a warning');

      watcher.unhook(console);
      done();
    });

    console.warn('a warning');
  });

  it('should watch console debugs.', done => {
    let watcher = new ConsoleWatcher();
    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.debug);
      event.data.should.equal('a debug');

      watcher.unhook(console);
      done();
    });

    console.debug('a debug');
  });

  it('should watch console infos.', done => {
    let watcher = new ConsoleWatcher();
    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.info);
      event.data.should.equal('an info');

      watcher.unhook(console);
      done();
    });

    console.info('an info');
  });

  describe('.unhook()', () => {
    it('should unhook from console', () => {
      let watcher = new ConsoleWatcher();
      let watched = false;

      watcher.watch(console).watched(event => watched = true);
      console.log('some log');
      watched.should.be.true;

      watcher.unhook(console);
      watched = false;
      console.log('some other log');
      watched.should.be.false;
    });
  });

  it('should work properly on an already watched console', done => {
    let watcherA = new ConsoleWatcher();
    let watcherB = new ConsoleWatcher();

    watcherA.watch(console).watched(event => {
      watcherA.unhook(console);
    });

    watcherB.watch(console).watched(event => {
      watcherB.unhook(console);
      done();
    });

    console.log('some log');
  });
});
