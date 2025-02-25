const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const { authService } = require('../services');

const auth = () => async (req, res, next) => {
  try {
    let apiToken;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
      [, apiToken] = authorization.split(' ');
    }

    if (!apiToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not authorized');
    }

    const email = authService.decodeJWTToken(apiToken);

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Your account does not exist');
    }

    req.user = user;
    next();
  } catch (e) {
    // Should replace with logger
    console.error(`Error from auth: ${e}`);
    next(new ApiError(httpStatus.BAD_REQUEST, e.message));
  }
};

module.exports = { auth };
