const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");

const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;
const bookSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: uuidv4 },
    title: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    review: { type: String},
  },
  {
    timestamps: true,
  }
);

// Create index
bookSchema.index({ id: 1});
bookSchema.index({ title: 'text'} )
bookSchema.index({ ibsn: 1})
bookSchema.index({ author: 'text' })
bookSchema.index({ category: 'text' })

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

module.exports = mongoose.model('Book', bookSchema);
