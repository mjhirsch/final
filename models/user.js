var mongoose = require('mongoose');

/**
 * Create a schema (blueprint) for all users in the database.
 * If you want to collect additional info, add the fields here.
 * We are setting required to true so that if the field is not
 * given, the document is not inserted. Unique will prevent
 * saving if a duplicate entry is found.
 */
var userSchema = mongoose.Schema({
  googleID: {
	  type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
});


// Our user model
var User = mongoose.model('user', userSchema);

// Make user model available through exports/require
module.exports = User;