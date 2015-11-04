angular.module('App', ['ngRoute','ngRating'])

angular.module('App')
	.config(['$routeProvider', function($routeProvider){
		// No need to define #, it is assume
		// console.log('config')
		$routeProvider
			.when('/', {
				templateUrl : '/html/input.html',
				controller : 'reviewController'
			})
			.when('/profile', {
				templateUrl : '/html/profile.html',
				controller : 'userController'
			})
			.when('/list', {
				templateUrl : '/html/list.html',
				controller : 'rentalController'
			})
			.when('/neighbors', {
				templateUrl : '/html/neighbors.html',
				controller : 'rentalController'
			})
			.when('/myreviews', {
				templateUrl : '/html/myreviews.html',
				controller : 'reviewController'
			})
			.when('/rental/:_id', {
				templateUrl : '/html/rental.html',
				controller : 'reviewController'
			})
			.when('/error', {
				templateUrl : '/html/error.html'
			})
			.otherwise({
				redirectTo : '/error'
			})

	}])


angular.module('App')
	.service('authService', ['$http', '$location', function($http){
		
		this.authCheck = function(cb){
			$http.get('/api/me')
				.then( function(returnData){
					cb(returnData.data)

				})
		}
					
						
	}])

angular.module('App')
	.controller('mainController', ['$scope', '$http', 'authService', '$location', function($scope, $http, authService, $location){
		$scope.hideSideNav = true;

		console.log('hello mainController')

		$scope.googleID = window.location.pathname.split('/')[2]
		console.log('userController')
		$scope.userInfo = {}

		$http.get('/api/user/' + $scope.googleID)
			.then(function(returnData){
				console.log(returnData)
				$scope.userInfo = returnData.data
				// console.log($scope.userInfo)
			})

		$scope.clickShowSideNav = function(){
			if ($scope.hideSideNav) {
				$scope.hideSideNav = false
				$scope.displayNone = true

			} else{
				$scope.hideSideNav = true
				$scope.displayNone = false
			};

		}

		$scope.linkAddReview = function(){
			$location.url('/')
		}

		$scope.linkLandlordsList = function(){
			$location.url('/list')
		}

		$scope.neighborhoodList = function(){
			$location.url('/neighbors')
		}

		$scope.profileClick = function(){
			$location.url('/profile')
		}

		$scope.myReviewsClick = function(){
			$location.url('/myreviews')
		}

		// $http.get('/api/user')
		// 	.then(function(returnData){
		// 		console.log(returnData.data)
		// 		$scope.users = returnData.data
		// 	})


		// $http.get('https://www.googleapis.com/gmail/v1/users/refactorfinal/messages')
		// 	.then(function(returnData){
		// 		$scope.messageList = returnData.data
		// 		console.log($scope.messageList)
		// 	})

	}])

angular.module('App')
	.controller('reviewController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
		var rentalID = $routeParams._id		
		// console.log(rentalID)

		$scope.hideEdit = true

		$scope.createReview = function(){
			$scope.userInfo
			$scope.review.googleID = $scope.userInfo.googleID;
			var addressConcat = $scope.review.street.concat($scope.review.city, $scope.review.state, $scope.review.zip)
			$scope.review.address = addressConcat.toLowerCase()
			console.log($scope.review)
			$http.post('/api/reviews', $scope.review)
				.then(function(returnData){
					console.log('added a review', returnData)
				})
			$scope.review = {}
		}

		$http.get('/api/reviews/' + $scope.googleID)
			.then(function(returnData){
				$scope.myReviews = returnData.data
				console.log($scope.myReviews)
			})

		$http.get('/api/reviews')
			.then(function(returnData){
				$scope.reviews = returnData.data
				// console.log($scope.reviews)
			})

		$scope.editReview = function(review){
			console.log(review)
			$scope.updateReview = review
			$scope.hideEdit = false

			$scope.editReviewSubmit = function(){

				$http.post('/api/reviews/' + $scope.updateReview._id, $scope.updateReview)
					.then(function(returnData){
						console.log('updated a review', returnData)
					})
			}

		}
		$scope.specificRental = {}
		$http.get('/api/rental/' + rentalID)
			.then(function(returnData){
				console.log('/api/rental/RentalID get:', returnData.data)
				$scope.specificRental = returnData.data[0];
				
			
			var specificRentalID = $scope.specificRental._id
			console.log(specificRentalID)
			$http.get('/api/reviews/rental/' + specificRentalID)
				.then(function(returnData){
					console.log(returnData.data)
					$scope.rentalReviews = returnData.data
				})

			})
	}])

angular.module('App')
	.controller('userController', ['$scope', '$http', 'authService', function($scope, $http, authService){

		$http.get('/api/user/' + $scope.googleID)
			.then(function(returnData){
				console.log(returnData)
				$scope.userInfo = returnData.data
				// console.log($scope.userInfo)
			})

	}])

angular.module('App')
	.controller('rentalController', ['$scope', '$http', 'authService', '$routeParams', '$location', function($scope, $http, authService, $routeParams, $location){
		console.log('hello')
		
		$http.get('/api/rental')
			.then(function(returnData){
				console.log('/api/rental get:', returnData)
				$scope.landlords = returnData.data;
			})

		$scope.landLordClick = function(landlord){
			console.log(landlord)
			$location.url('/rental/'+ landlord._id)
		}

		$scope.zipCodeSearch ={zip: 10950}
		
		$scope.clickSearchZip = function(){
		console.log($scope.zipSearch)
			$http.post('/api/neighbors', {zip : $scope.zipSearch})
				.then(function(returnData){
					// console.log('/api/rental get:', returnData)
					$scope.neighborList = returnData.data;
					console.log($scope.neighborList)
				})

		}


	}])
		