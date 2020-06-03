const lockFile = require('lockfile');

module.exports.lock = function(pathmapfileLock, opt = { retries: 50, stale: 10000, pollPeriod: 50 }) {
  return new Promise((resolve, reject) => {
    lockFile.lock(pathmapfileLock, opt, function (error) {
      if(error) {
        reject(error);
        return;
      }

      resolve(true);
    })
  });
};

module.exports.unlock = function(pathmapfileLock) {
  return new Promise((resolve, reject) => {
    lockFile.unlock(pathmapfileLock, function (error) {
      if(error) {
        reject(error);
        return;
      }

      resolve(true);
    })
  });
};