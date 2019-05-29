const jwt = require('jsonwebtoken');
const token = require('./token');

const secret = token();

const sign = () => new Promise((resolve, reject) => {
  jwt.sign({
    connect_shell_access: true
  },
  secret,
  {
    expiresIn: '1h'
  }, (err, token) => {
    if (err) reject(err);
    else resolve(token);
  });
});

const verify = token => {
  try {
    return jwt.verify(token, secret).connect_shell_access;
  }
  catch(err) {
    return false;
  }
};

module.exports = {
  sign: sign,
  verify: verify,
}
