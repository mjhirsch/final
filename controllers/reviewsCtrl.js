var Review = require('../models/reviews')
var Rental = require('../models/rental')

var addReview = function(req, res){

	Rental.findOne({address : req.body.address}, function(err, address){
		console.log(address)
		if (address) {

			var newReview = new Review({
				  rental: address['_id'],
				  lLComments: req.body.lLComments,
				  neighborhoodComments: req.body.neighborhoodComments,
				  rating: req.body.rating,
				  googleID: req.body.googleID,
				  zip : address['zip'],
				  hoodRating : req.body.hoodRating 
				});

				console.log('existingRental',newReview)
				newReview.save( function(err, doc){
					res.send(doc)
				})

		} else{

			var newRental = new Rental({
				lLName  :req.body.lLName,
				address :req.body.address,
				street  :req.body.street,
				city    :req.body.city,
				state   :req.body.state,
				zip     :req.body.zip 
			})

			newRental.save(function(err, doc){

				console.log('err', err, 'doc:', doc)
				var newReview = new Review({
					  rental: doc['_id'],
					  lLComments: req.body.lLComments,
					  neighborhoodComments: req.body.neighborhoodComments,
					  rating: req.body.rating,
					  googleID: req.body.googleID,
					  zip: doc['zip'],
					  hoodRating : req.body.hoodRating
					});

					console.log('newReview:', newReview)
					newReview.save( function(err, doc){
						res.send(doc)
					})
			})
		};
	})


	}

var findReviews = function(req, res){

		if (req.params.googleID) {
			Review.find({googleID : req.params.googleID}, function(err, doc){
				res.send(doc)
			})
		} 
		else{
		Review.find({}, function(err, docs){
					res.send(docs)
				})
		}
	};

var updateReview = function(req, res){

	console.log(req.body)
	Review.save(req.body, function(err, doc){
		res.send(doc)
	})
}

var findRentals = function(req, res){

	// Rental.find({}, function(err, docs){
	// 			res.send(docs)
	// 		})

	if (req.params.rentalID) {
		Rental.find({_id : req.params.rentalID}, function(err, doc){
			res.send(doc)
		})
	} 
	else{
	Rental.find({}, function(err, docs){
				res.send(docs)
			})
	}
}


var findRentalReviews = function(req, res){
	console.log('reck that param', req.params.specificRentalID)
	Review.find({rental : req.params.specificRentalID}, function(err, docs){
		console.log('docs:', docs)
		console.log('err:', err)
		res.send(docs)
	})

}

var findNeighbors = function(req, res){
	console.log('findNeighors:',req.body)
	Review.find({zip : req.body.zip}, function(err, docs){
				res.send(docs)
			})
}



module.exports = {
	addReview         : addReview,
	findReviews       : findReviews,
	updateReview      : updateReview,
	findRentals       : findRentals,
	findRentalReviews : findRentalReviews,
	findNeighbors     : findNeighbors
}