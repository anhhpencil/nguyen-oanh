const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');
const { system } = require('../config/config');
const { decrypt } = require('../utils/crypto');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isCorrectPassword = async function (password) {
  const user = this;
  return decrypt(user.password, system.secret) === password;
};

module.exports = mongoose.model('User', userSchema);
