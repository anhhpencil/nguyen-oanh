const { Router } = require('express');

const { bookController } = require('../controllers');
const validate = require('../middlewares/validate');
const { bookValidation } = require('../validations');
const { auth } = require('../middlewares/auth');

const route = Router();

route.get('/', validate(bookValidation.getAllBook), bookController.getAllBook);
route.get('/search', validate(bookValidation.findBook), bookController.findBook);

route.post('/', auth(), validate(bookValidation.addBook), bookController.addBook);

route.put('/', auth(), validate(bookValidation.updateBook), bookController.updateBook);
route.delete('/', auth(), validate(bookValidation.deleteBook), bookController.deleteBook);

module.exports = route;
