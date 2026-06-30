/**
 * models/userModel.js
 * -------------------
 * Defines the shape of a User document in MongoDB.
 *
 * Beginner note:
 * The password field stores the HASHED password, not the plain password.
 * Hashing is done in controllers/userController.js before saving.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)