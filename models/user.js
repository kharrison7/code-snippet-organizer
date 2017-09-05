let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
 title:  {type: String, required: true, unique: true},
 author: String,
 price: Number,
 triedRecipe: [{
   recipeTitle: String,
   tasty: {type: Boolean, default: true},
   pageNumber: Number
 }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
