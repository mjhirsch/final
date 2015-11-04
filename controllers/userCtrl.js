
var User = require('../models/user')

var findUsers = function(req, res){
	
	if (req.params.googleID) {

		User.findOne({googleID : req.params.googleID}, function(err, doc){
			res.send(doc)
		})

		} 
	else{

			User.find({}, function(err, docs){
				res.send(docs)
			})
		}
	};


module.exports = {
	findUsers : findUsers
}