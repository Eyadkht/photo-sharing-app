adminDashboardModule.controller("adminDashboardController", ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window){
	
	$scope.title = "Events";
	
	console.log("In dashboard controller");
	var auth = "Bearer "+ $cookies.get('Authorization')
	console.log(auth)
	// GET events created
	    $http({
		        method: 'GET',
		        url: 'https://photosharingapp-staging.appspot.com/test_protected_view/',
		        headers:{
		            'Authorization': auth
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
			date: "2019-12-31",
			active: true,
			pin: "1234",
			description: "This is a new years eve party, etc ...",
			location: "London, England"},
		 {
			name: "Christmas Party",
			date: "2019-12-25",
			active: true,
			pin: "4321",
			description: "This is a Christmas party, etc ...",
			location: "London, England"},
		 
		 {
			name: "Summer Event",
			date: "2020-06-20",
			active: false,
			pin: "6789",
			description: "This is a summer event, etc ...",
			location: "Paris, France"},
	];
	
	// This function is used to display the information of a specified event in the edit pane
	$scope.displayEvent = function(eventID)
	{
		document.getElementById('eventName').value = $scope.events[eventID].name;
		document.getElementById('eventDate').value = $scope.events[eventID].date;
		document.getElementById('eventIsActive').checked = $scope.events[eventID].active;
		document.getElementById('eventPin').value = $scope.events[eventID].pin;
		document.getElementById('eventDescription').value = $scope.events[eventID].description;
		document.getElementById('eventLocation').value = $scope.events[eventID].location;
	}
	
	// This function will make a request to the back end to create a new event
	$scope.createEvent = function()
	{
		
	}
	
	// This function will make a request to the back end to modify a specific event
	$scope.saveEvent = function(eventID)
	{
		
	}
	
	$scope.deleteEvent = function(eventID)
	{
		alert("Event deleted.");
	}
	
	// Simple Function for showing the logout button
	$scope.showLogout = function()
	{
		document.getElementById('logoutButton').style.display = "block";
	}

	$scope.logout = function()
	{
		document.getElementById('logoutButton').style.display = "none";
	}


	$scope.eventlink = function (){
		console.log('here')
		$window.location.href = './events';	
	}
}]);