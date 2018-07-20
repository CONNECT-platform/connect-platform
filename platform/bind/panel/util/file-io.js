const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');


const load = address => {
  return new Promise((resolve, reject) => {
    fs.readFile(address, 'utf8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

const loadJson = (address, _default) => {
  return new Promise((resolve, reject) => {
    load(address + '.json').then(data => {
      try {
        resolve(JSON.parse(data));
      } catch(error) {
        if (_default) resolve(_default);
        else reject(error);
      }
    }).catch(error => {
      if (_default) resolve(_default);
      else reject(error);
    });
  });
}

const save = (address, content) => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(address), error => {
      if (error) reject(error);
      else {
        fs.writeFile(address, content, 'utf8', error => {
          if (error) reject(error);
          else resolve();
        });
      }
    });
  });
}

const saveJson = (address, json) => {
  return new Promise((resolve, reject) => {
    try {
      save(address + '.json', JSON.stringify(json, null, 2))
          .then(resolve)
          .catch(error => reject(error));
    } catch(error) {
      reject(error);
    }
  });
}

const _delete = address => {
  return new Promise((resolve, reject) => {
    fs.unlink(address, error => {
      if (error) reject(error);
      else resolve();
    })
  });
}

const deleteJson = address => {
  return _delete(address + '.json');
}

module.exports.load = load;
module.exports.save = save;
module.exports.delete = _delete;
module.exports.json = {
  load : loadJson,
  save : saveJson,
  delete: deleteJson,
}
