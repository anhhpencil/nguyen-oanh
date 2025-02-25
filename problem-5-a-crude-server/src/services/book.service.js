const ApiError = require('../utils/ApiError');
const { STATUS_CODE } = require('../config/internal-code');

const { Book } = require('../models');


const addBook = async (title, isbn, price, author, category, review) => {
    const isExisted = await Book.findOne({ isbn});
    if (isExisted) {
        throw new ApiError(STATUS_CODE.EXISTED_VALUE, 'The book has been existed.');
    };

    await Book.create({
        title,
        isbn,
        price,
        author,
        category,
        review
    });

    return {};
};

const updateBook  = async (id, title, isbn, price, author, category, review) => {

    const updateValue = {
        title,
        isbn, 
        price, 
        author, 
        category, 
        review
    };

    let existedBook = false;

    if(id) {
        existedBook = await Book.findOne({ id });
    } else {
        existedBook = await Book.findOne({ isbn });
    }
   
    if (!existedBook) {
        throw new ApiError(STATUS_CODE.EXISTED_VALUE, 'The book has not existed.');
    };

    await Book.findOneAndUpdate({ id: existedBook.id }, { $set: updateValue });

    return {};
};

const deleteBook = async (id, isbn) => {

    let existedBook = false;

    if (id) {
        existedBook = await Book.findOne({ id });
    } else {
        existedBook = await Book.findOne({ isbn });
    }

    if (!existedBook) {
        throw new ApiError(STATUS_CODE.EXISTED_VALUE, 'The book has not existed.');
    };

    await Book.findOneAndDelete({ id: existedBook.id });

    return {};
};

const getBook = async  (filter, options) =>{
    const books = await Book.paginate(filter, options);
    const { results, totalPages, totalResults } = books;
  
    return { totalBook: totalResults, books: results, totalPages };
}


module.exports = {
    addBook,
    updateBook,
    deleteBook,
    getBook,
}