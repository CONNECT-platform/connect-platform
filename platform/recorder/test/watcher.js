const should = require('chai').should();
const { Subscribable } = require('../../core/base/subscribable');
const { Watcher, WatcherEvents } = require('../watcher');


describe('Watcher', () => {
  it('should watch events on a subscribable', done => {
    let subject = new Subscribable();
    let events = { event : 'event' };

    let watcher = new Watcher(events).watch(subject);

    watcher.subscribe(WatcherEvents.watched, event => {

      event.event.should.equal(events.event);
      event.subject.should.equal(subject);
      event.data.hellow.should.equal('world');

      done();
    });

    subject.publish(events.event, { hellow : 'world' });
  });

  describe('.watched()', () => {
    it('should do callbacks on watching (basically easier subscribing)', done => {
      let subject = new Subscribable();
      let events = { event : 'event' };

      new Watcher(events).watch(subject).watched(event => {
        done();
      });

      subject.publish(events.event);
    });
  });
});
