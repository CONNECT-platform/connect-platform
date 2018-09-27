const should = require('chai').should();

const { Watcher, WatcherEvents } = require('../watcher');
const { ConsoleWatcher, ConsoleEvents } = require('../console-watcher');


describe('ConsoleWatcher', () => {
  it('should watch console logs.', done => {
    let watcher = new ConsoleWatcher();

    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.logged);
      event.data.length.should.equal(1);
      event.data[0].should.equal('a log');

      watcher.unhook(console);
      done();
    });

    console.log('a log');
  });

  it('should watch console errors.', done => {
    let watcher = new ConsoleWatcher();

    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.erred);
      event.data[0].should.equal('an error');

      watcher.unhook(console);
      done();
    });

    console.error('an error');
  });

  it('should watch console warnings.', done => {
    let watcher = new ConsoleWatcher();
    watcher.watch(console).watched(event => {
      event.event.should.equal(ConsoleEvents.warned);
      event.data[0].should.equal('a warning');

      watcher.unhook(console);
      done();
    });

    console.warn('a warning');
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
});
