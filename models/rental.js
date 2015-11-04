var mongoose = require('mongoose');

var rentalSchema = mongoose.Schema({
  lLName: {
	type    : String,
    required: true,
  },
  address: {
    type    : String,
    required: true,
    unique: true
  },
  street: {
    type    : String,
    required: true
  },
  city : {
    type    : String,
    required: true
  },
  state : {
    type    : String,
    required: true
  },
  zip : {
    type    : Number,
    required: true
  }
  // add an array (update method) of just star rating to average all reveiws
});

// Our user model
var Rental = mongoose.model('rental', rentalSchema);
// Make user model available through exports/require
module.exports = Rental;