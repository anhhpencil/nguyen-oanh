const ApiError = require('../utils/ApiError');
const { STATUS_CODE } = require('../config/internal-code');

const { User } = require('../models');

const config = require('../config/config');

const authService = require('./auth.service');
const { encrypt } = require('../utils/crypto');

/**
 * singup servide
 * @param {string} email
 * @param {string} password
 * @returns {}
 */
const signup = async (email, password) => {
  const splitEmail = email.split('@');
  let validEmail = email;

  if (splitEmail[1] === 'gmail.com') {
    // Only gmail has this issue
    const dotEmail = splitEmail[0].replaceAll('.', '');
    const spitPlus = dotEmail.split('+');
    validEmail = `${spitPlus[0]}@${splitEmail[1]}`;
  }

  const existePlayer = await User.findOne({ email: validEmail });
  if (existePlayer) {
    throw new ApiError(STATUS_CODE.EXISTED_VALUE, 'The email has existed.');
  }
  const encrytedPassword = encrypt(password, config.system.secret);

  await User.create({
    email: validEmail,
    password: encrytedPassword,
  });

  return {};
};

/**
 * login servide
 * @param {string} email
 * @param {string} password
 * @returns {}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS_CODE.NOT_FOUND, 'Please register an account.');
  }

  if (!(await user.isCorrectPassword(password))) {
    throw new ApiError(STATUS_CODE.NOT_FOUND, 'Wrong credential.');
  }

  const apiToken = authService.generateAccessToken(email);

  return {
    email,
    apiToken,
  };
};

module.exports = {
  login,
  signup,
};
