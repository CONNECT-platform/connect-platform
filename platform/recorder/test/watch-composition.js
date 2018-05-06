const should = require('chai').should();

const core = require('../../core');
const fromJSON = require('../../builder/from-json');
const { Composition } = require('../../builder/composition');

const watch = require('../watch');


describe('watch() for compositions', () => {
  let json = `{
    "path": "/hellow-world/",
    "in": [ "name" ],
    "out": [ "message" ],
    "configs": [ "greet" ],
    "control": [],
    "nodes": [
      {
        "tag": "e0",
        "in": [ "name", "greet" ],
        "expr": "greet + ' ' + name"
      }
    ],
    "links": [
      [{ "in": "name"}, { "e0": { "in": "name" }}],
      [{ "e0": "result" }, { "out": "message" }],
      [{ "config": "greet" }, { "e0": { "in": "greet" }}]
    ]
  }
  `;

  let recipe = fromJSON(json);
  let comp = new Composition();
  recipe.apply(comp);


  it('should watch compositions correctly', done => {
    let watchables = {
      compIn : false,
      compConf : false,
      nodeInName : false,
      nodeInGreet : false,
      nodeActivate : false,
      nodeOut : false,
      compOut : false,
    };

    watch(comp).watched(event => {
      if (event.tag == 'in') {
        watchables.compIn = true;

        event.cascaded.tag.should.equal('name');
        event.cascaded.cascaded.data.should.equal('jafar');
      }

      if (event.tag == 'conf') {
        watchables.compConf = true;

        event.cascaded.tag.should.equal('greet');
        event.cascaded.cascaded.data.should.equal('salam');
      }

      if (event.tag == 'out') {
        watchables.compOut = true;

        event.cascaded.tag.should.equal('message');
        event.cascaded.cascaded.data.should.equal('salam jafar');
      }

      if (event.tag == 'node') {
        event.cascaded.tag.should.equal('e0');

        if (event.cascaded.cascaded.event == core.events.node.activate)
          watchables.nodeActivate = true;

        if (event.cascaded.cascaded.tag == 'in') {
          if (event.cascaded.cascaded.cascaded.tag == 'name') {
            watchables.nodeInName = true;
            event.cascaded.cascaded.cascaded.cascaded.data.should.equal('jafar');
          }

          if (event.cascaded.cascaded.cascaded.tag == 'greet') {
            watchables.nodeInGreet = true;
            event.cascaded.cascaded.cascaded.cascaded.data.should.equal('salam');
          }
        }

        if (event.cascaded.cascaded.tag == 'out') {
          watchables.nodeOut = true;
          event.cascaded.cascaded.cascaded.cascaded.data.should.equal('salam jafar');
        }
      }

      if (Object.values(watchables).every(item => item)) done();
    });

    comp.start({name : 'jafar'}, {greet : 'salam'});
  });
});
