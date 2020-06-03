const path = require('path');
const files = require('../../../../bind/panel/util/file-io');

module.exports.deleteNodes = function(requester, ids) {
  const promises = [];

  for(let k in ids) {
    if(ids[k]) {
      promises.push(requester.delete(`/panel/delete/${ids[k]}`));
    }
  }

  return Promise.all(promises);
}

module.exports.validateDeleteCalls = function(results, validatePathmap = true) {
  for(let k in results) {
    results[k].status.should.equal(200);
    results[k].should.have.property('body');
    results[k].body.should.equal('deleted');
  }

  if(validatePathmap) {
    let pathmapfile = path.join('test-app/panel-generated', 'path-map');

    return files.json.load(pathmapfile, {})
    .then((pathmap) => {
      pathmap.should.eql({});

      return pathmap;
    });
  }
}