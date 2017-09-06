let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
 username:  {type: String, required: true, unique: true, lowercase: true},
 email: {type: String, lowercase: true},
 password: {type: String, required: true},
 sessionID: {type: String}
  },
  {timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
