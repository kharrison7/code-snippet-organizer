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

let User = mongoose.model('User', userSchema);
module.exports = {
  User
}

// creates a hash from a password.
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// Finds a document with the specificed username.
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

// Finds a user by id.
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Compares a given password with a hash password to validate login.
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
