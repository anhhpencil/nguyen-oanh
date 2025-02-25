const { Router } = require('express');

const { userController } = require('../controllers');
const validate = require('../middlewares/validate');
const { userValidation } = require('../validations');

const route = Router();

route.post('/signup', validate(userValidation.signup), userController.signup);
route.post('/login', validate(userValidation.login), userController.login);

module.exports = route;
