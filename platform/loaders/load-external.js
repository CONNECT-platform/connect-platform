const process = require('child_process');

const ct = require('../util/color-text');


module.exports = (info, callback) => {
  try {
    callback(require(info.name), info.name);
  } catch(_) {
    console.log(ct(ct.blue + ct.bright, 'EXTERNAL PACKAGE MISSING::') +
          ` attempting to install ${ct(ct.underscore, info.name)} via ${ct(ct.dim + ct.underscore, info.source)}`);
    process.exec(`npm install ${info.source}`, error => {
      if (error) {
        console.log(ct(ct.red + ct.bright, `ERROR:: could not install ${info.name}: `) + error);
      }
      else {
        try {
          callback(require(info.name), info.name);
          console.log(ct(ct.blue + ct.bright, 'EXTERNAL PACKAGE INSTALLED::') + ct(ct.underscore, info.name));
        } catch(error) {
          console.log(ct(ct.red + ct.bright, `ERROR:: could not install ${info.name}`));
        }
      }
    });
  }
}
