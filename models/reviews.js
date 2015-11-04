var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
  rental: {
	type    : String,
    required: true,
  },
  lLComments: {
    type: String,
    required: true
  },
  neighborhoodComments: {
    type: String,
  },
  rating: {
    type: Number,
    required: true
  },
  hoodRating: {
    type: Number,
    required: true
  },
  zip: {
    type: Number,
    required: true
  },
  googleID:{
  	type    : String,
  	required: true,
  }
});

// Our user model
var Review = mongoose.model('review', reviewSchema);

// Make user model available through exports/require
module.exports = Review;