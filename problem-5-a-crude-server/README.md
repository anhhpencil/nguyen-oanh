# Online BookStore API server
This is a RESTful API for a basic online bookstore. It allows users to manage books in the store, including adding, updating, deleting, and retrieving books. Certain endpoints are protected and require authentication.


## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [API Endpoints](#api-endpoint])
- [Questions & Answer](#question)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using JWT token
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **handling**: centralized error handling mechanism
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**

## Commands

### Running locally (without Docker):

```bash
yarn 
yarn start
```

**Note**: Make sure you create an .env file as .env.sample 


#### Running with Docker:

```bash
# run docker container in development mode
yarn docker
```

**Note**: Make sure you ready install Docker & Docker compose before running. Also remember create .env file


## Project Structure
```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
    "hasError": true,
    "statusCode": 200,
    "internalCode": 700,
    "message": "Something wrong happened",
    "data": {},
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const { Router } = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const stakingValidation = require('../../validations/userStaking.validation');
const stakingController = require('../../controllers/userStaking.controller');

const router = express.Router();

route.get('/check/address', auth(), validate(stakingValidation.getAddressInfo), stakingController.getAddressInfo);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth(), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.


## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `UserStaking` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## API Endpoints

### Add a New Book
- Endpoint: POST /api/books
- Description: Adds a new book to the store.
- Request Body:
    - title: The title of the book (string).
    - isbn: The ISBN number of the book (string).
    - price: The price of the book (number).
    - author: The author of the book (string).
    - review: A review of the book (string, optional).
- Response:
    - 200 OK: Returns the created book.
    - 400 Bad Request: If there is a validation error.
    - 401 Unauthorized: If the user is not authenticated.

- Example:

```bash
curl -X POST http://localhost:8080/api/books \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"title": "New Book", "isbn": "1234567890123", "price": 19.99, "author": "John Doe", "category": "60c72b2f9b1e8c001f8e4c9b"}'
```

### Update a Book
- Endpoint: PUT /api/books
- Description: Updates an existing book by ID or ISNB
- Request Body:
    - id: the id of the book (string, optional).
    - title: The title of the book (string).
    - isbn: The ISBN number of the book (string, required).
    - price: The price of the book (number).
    - author: The author of the book (string).
    - review: A review of the book (string, optional).
- Response:
    - 200 OK: Returns the updated book.
    - 404 Not Found: If the book does not exist.
    - 401 Unauthorized: If the user is not authenticated.
    - 500 Internal Server Error: If there is an error updating the book.

- Example:

```bash
curl -X PUT http://localhost:5000/api/books \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"title": "New Book", "isbn": "1234567890123", "price": 19.99, "author": "John Doe", "category": "60c72b2f9b1e8c001f8e4c9b"}'
```

### Delete a book
- Endpoint: DELETE /api/books/
- Description: Deletes a book by its ID or ISBN.
- Request Body:
    - id: the id of the book (string).
    - isbn: The ISBN number of the book (string).
- Response:
    - 200 OK: If the book was deleted.
    - 404 Not Found: If the book does not exist.
    - 401 Unauthorized: If the user is not authenticated.
    - 500 Internal Server Error: If there is an error deleting the book.

- Example:

```bash
curl -X DELETE http://localhost:5000/api/books \
-H "Authorization: Bearer <your_token>" \
-H "Content-Type: application/json" \
-d '{"id": "123e4567-e89b-12d3-a456-426614174000", "isbn": "1234567890123"}'
```

### Get all book
- Endpoint: GET /api/books
- Description: Retrieves a list of all books with a limit of 100.
- Response:
    - 200 OK: Returns a list of books.
    - 500 Internal Server Error: If there is an error retrieving the books.
- Example: 
```bash
curl -X GET http://localhost:5000/api/books
```

### Search a book by title, id, isbn, author, cateogry, price (in range)
- Endpoint: GET /api/books/search
- Description: Retrieves a book by its title, id, isbn, author, cateogry, price (in range)
- Response:
    - 200 OK: Returns the book details.
    - 500 Internal Server Error: If there is an error retrieving the book
- Example:
```bash
curl -X GET http://localhost:5000/api/search?id=123e4567-e89b-12d3-a456-426614174000
```