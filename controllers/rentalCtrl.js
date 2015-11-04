var Rental = require('../models/rental')

var findRentals = function(req, res){

	Rental.find({}, function(err, docs){
				res.send(docs)
			})
}


module.exports = {
	findRentals : findRentals
 }