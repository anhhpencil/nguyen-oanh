const Joi = require('joi');

const addBook = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        isbn: Joi.string().required(),
        price: Joi.number().required(),
        author: Joi.string().required(),
        category: Joi.string().required(),
        review: Joi.string(),
    }),
};


const updateBook = {
    body: Joi.object().keys({
        id: Joi.string(),
        title: Joi.string().required(),
        isbn: Joi.string().required(),
        price: Joi.number().required(),
        author: Joi.string().required(),
        category: Joi.string().required(),
        review: Joi.string(),
    }),
};

const deleteBook = {
    body: Joi.object().keys({
        id: Joi.string(),
        isbn: Joi.string(),
    }),
};

const getAllBook = {
    query: Joi.object().keys({
        limit: Joi.number().integer().default(100),
        page: Joi.number().integer().default(1),
    }),
};

const findBook = {
    query: Joi.object().keys({
        id: Joi.string(),
        title: Joi.string(),
        isbn: Joi.string(),
        minPrice: Joi.number(),
        maxPrice:Joi.number(),
        author: Joi.number(),
        category:Joi.number()
    }),
};


module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getAllBook,
    findBook,
};
