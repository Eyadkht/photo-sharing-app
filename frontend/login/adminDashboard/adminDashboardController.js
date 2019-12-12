adminDashboardModule.controller("adminDashboardController", function ($scope, $http) {

	$scope.title = "Events";
	console.log("In dashboard controller");

	// GET events created
	$http({
		method: 'GET',
		url: 'https://tallyapp.me/api/v1.1/location/',
		params: {
			query: 'id'
		}
	}).then(function successCallback(response) {
		// this callback will be called asynchronously
		// when the response is available
		// change to next url 
		
	}, function errorCallback(response) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});



	$scope.events =
		[
			{
				name: "New Years Party",
				date: "31-12-2019",
				active: true,
				pin: "1234",
				description: "This is a new years eve party, etc ...",
				location: "London, England"
			},
			{
				name: "Christmas Party",
				date: "25-12-2019",
				active: true,
				pin: "4321",
				description: "This is a Christmas party, etc ...",
				location: "London, England"
			},

			{
				name: "Summer Event",
				date: "20-06-2020",
				active: false,
				pin: "6789",
				description: "This is a summer event, etc ...",
				location: "Paris, France"
			},
		];

	// Creating constants representing the page state (either a login page or a register page)
	$scope.LOGIN = 0;
	$scope.REGISTER = 1;

	$scope.LoginOrRegister = $scope.LOGIN;


});