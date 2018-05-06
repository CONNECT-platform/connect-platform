const should = require('chai').should();

const { Subscribable } = require('../../core/base/subscribable');

const { Watcher } = require('../watcher');
const { CompositeWatcher } = require('../composite-watcher');


describe('CompositeWatcher', () => {
  it('should also watch multiple watchers with additional tags', done => {
    let events = { event : 'event' };
    let eventsA = { event : 'eventA' };
    let eventsB = { event : 'eventB' };

    let subject = new Subscribable();
    let subjectA = new Subscribable();
    let subjectB = new Subscribable();

    let watcherA = new Watcher(eventsA).watch(subjectA);
    let watcherB = new Watcher(eventsB).watch(subjectB);

    let compositeWatcher = new CompositeWatcher(events)
      .watch(subject)
      .mount('a', watcherA)
      .mount('b', watcherB);

    let swatched = false;
    let sawatched = false;
    let sbwatched = false;

    compositeWatcher.watched(event => {
      if (event.event == events.event) swatched = true;
      if (event.tag == 'a') {
        sawatched = true;

        event.cascaded.event.should.equal(eventsA.event);
        event.cascaded.data.should.equal('data a');
      }

      if (event.tag == 'b') {
        sbwatched = true;
        event.cascaded.event.should.equal(eventsB.event);
        event.cascaded.data.should.equal('data b');
      }

      if (swatched && sawatched && sbwatched) done();
    });

    subject.publish(events.event);
    subjectA.publish(eventsA.event, 'data a');
    subjectB.publish(eventsB.event, 'data b');
  });
});
