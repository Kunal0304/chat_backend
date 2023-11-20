const jwt = require("jsonwebtoken");
const config = require('./config.json')

const generateToken = (id) => {
  return jwt.sign( {id} , config.auth.jwt_secret, {
    expiresIn: config.auth.jwt_expiresin,
  });
};

module.exports = generateToken;