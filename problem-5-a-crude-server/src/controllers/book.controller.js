const catchAsync = require('../utils/catchAsync');
const { bookService } = require('../services');

/**
 * Add a new book
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addBook = catchAsync(async (req, res) => {

    const { title, isbn, price, author, category, review } = req.body;

    await bookService.addBook( title, isbn, price, author, category, review );

    res.send({});
});

/**
 * Update a book
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateBook = catchAsync(async (req, res) => {

    const { id, title, isbn, price, author, category, review } = req.body;


    await bookService.updateBook(id, title, isbn, price, author, category, review);

    res.send({});
});

/**
 * Delete a book
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteBook = catchAsync(async (req, res) => {
    const { id, isbn} = req.body;
    console.log(id)

    await bookService.deleteBook(id, isbn);

    res.send({});
});

/**
 * Get all books
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllBook = catchAsync(async (req, res) => {
    const { limit, page } = req.query;

    const filter = {};
    const options = {
        sortBy: 'createdAt:desc', // sort order
        limit: Math.min(100, limit), // maximum results per page
        page, // page number
    };

    const data = await bookService.getBook(filter, options);

    res.send(data);
});


/**
 * Find a book by { id, title,  isbn, minPrice, maxPrice, author, categor}
 * @param {*} req
 * @param {*} res
 * @returns
 */
const findBook = catchAsync(async (req, res) => {
    const {id, title,  isbn, minPrice, maxPrice, author, category } = req.query;

    let filter = {};

    if (id) {
        filter = { id: id};
    } else if (title) {
        filter = { $text: {$search: title} };
    } else if (isbn) {
        filter = { isbn: isbn };
    } else if (author) {
        filter = { author: author };
    } else if (category) {
        filter = { category: category };
    } else if (minPrice) {
        filter = { price: {$gt: minPrice} };
    } else if (minPrice) {
        filter = { price: { $lt: maxPrice } };
    }

    const options = {
        sortBy: 'createdAt:desc', // sort order
        limit:20
    };

    const data = await bookService.getBook(filter, options);

    res.send(data);
});


module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getAllBook,
    findBook
};
