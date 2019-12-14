adminDashboardModule.controller("adminDashboardController", function($scope){
	
	$scope.title = "Events";
	
	$scope.events =
	[
		{
			name: "New Years Party",
			date: "31-12-2019",
			active: true,
			pin: "1234",
			description: "This is a new years eve party, etc ...",
			location: "London, England"},
		 {
			name: "Christmas Party",
			date: "25-12-2019",
			active: true,
			pin: "4321",
			description: "This is a Christmas party, etc ...",
			location: "London, England"},
		 
		 {
			name: "Summer Event",
			date: "20-06-2020",
			active: false,
			pin: "6789",
			description: "This is a summer event, etc ...",
			location: "Paris, France"},
	];
	
	// Creating constants representing the page state (either a login page or a register page)
	$scope.LOGIN = 0;
	$scope.REGISTER = 1;
	
	$scope.LoginOrRegister = $scope.LOGIN;
	

});