const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateAccessToken = (username, secret = config.jwt.secret) => {
  const payload = {
    id: username,
    iat: moment().unix(),
    expiresIn: config.jwt.expiration,
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify JWT token
 * @param {*} token
 * @returns
 */
const decodeJWTToken = (token) => {
  const decoded = jwt.verify(token, `${config.jwt.secret}`);
  return decoded.id;
};

module.exports = {
  decodeJWTToken,
  generateAccessToken,
};
