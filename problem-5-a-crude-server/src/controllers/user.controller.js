const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

/**
 * Signup function handler
 * @param {*} req
 * @param {*} res
 * @returns
 */
const signup = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  await userService.signup(email, password);

  res.send({});
});

/**
 * Login function handler.
 * @param {*} req
 * @param {*} res
 */

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await userService.login(email, password);

  res.send({ ...userInfo });
});

module.exports = {
  signup,
  login,
};
