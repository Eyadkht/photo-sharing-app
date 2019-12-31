adminDashboardModule.controller("adminDashboardController", ['$scope', '$http', '$cookies', '$window', function ($scope, $http, $cookies, $window) {

	$scope.title = "Your Events";

	

	console.log("In dashboard controller");
	var auth = "Bearer " + $cookies.get('Authorization')
	console.log(auth)
	// GET all events created by user
	$http({
		method: 'GET',
		url: 'https://photosharingapp-staging.appspot.com/api/events/',
		headers: {
			'Authorization': auth
		}
	}).then(function successCallback(response) {
		$scope.events = [];
		if ((response.data.length != 0)) {
			for (var i = 0; i < response.data.length; i++) {
				$scope.events.push({
					name: response.data[i].name,
					description: response.data[i].description,
					pk: response.data[i].pk,
					url_key: response.data[i].url_key
				});
			}
		}
		// Set Default Value for changing events
		$scope.EditeventName = $scope.eventName;

	}, function errorCallback(response) {
		alert(response)
		console.log(response)
	});



	// This function is used to display the information of a specified event in the edit pane
	$scope.displayEvent = function (eventID) {
		$scope.EditeventPk = $scope.events[eventID].pk;
		// Set Default Value for changing events
		$scope.EditeventName = $scope.events[eventID].name;
		console.log($scope.EditeventName)
		$scope.EditeventDescription = $scope.events[eventID].description;
		$scope.EditeventPin = $scope.events[eventID].pin;
		document.getElementById('eventName').value = $scope.events[eventID].name;
		document.getElementById('eventDate').value = $scope.events[eventID].date;
		document.getElementById('eventIsActive').checked = $scope.events[eventID].active;
		document.getElementById('eventPin').value = $scope.events[eventID].pin;
		document.getElementById('eventDescription').value = $scope.events[eventID].description;
		document.getElementById('eventLocation').value = $scope.events[eventID].location;
	}

	// This function will make a request to the back end to create a new event
	$scope.createEvent = function () {
		$http({
			method: 'POST',
			url: 'https://photosharingapp-staging.appspot.com/api/events/',
			headers: {
				'Authorization': auth
			},
			data: {
				"name": $scope.eventName,
				"description": $scope.eventDescription,
				"password": $scope.eventPin
			}
		}).then(function successCallback(response) {

			if (response.status == 201) {
				console.log(response)
				//alert('Event created successfully');
				$scope.events.push({
					name: $scope.eventName,
					description: $scope.eventDescription
				});
				console.log($scope.events)


			}
			else {
				console.log(response.data);
			}

		}, function errorCallback(response) {
			// Check for unique username and email
			if (response.data.username) {
				alert(response.data.username[0])
			}
			else if (response.data.email) {
				alert(response.data.email[0])
			}
			else {
				console.log(response.data);
			}
		});
	}

	$scope.showQR = function (event) {
		console.log(event.url_key)
		var qr_url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href + 'events/?=' + event.url_key + '&size=500x500'
		// Gemerate QR code
		$http({
			method: 'GET',
			url: qr_url
		}).then(function successCallback(response) {
			console.log(response)
		}, function errorCallback(response) {
			alert(response)
			console.log(response)
		});

	}

	// This function will make a request to the back end to modify a specific event
	$scope.saveEvent = function () {
		console.log($scope.EditeventName)


		$http({
			method: 'PUT',
			url: 'https://photosharingapp-staging.appspot.com/api/events/' + $scope.EditeventPk,
			headers: {
				'Authorization': auth
			},
			data: {
				"name": $scope.EditeventName,
				"description": $scope.EditeventDescription,
				"password": $scope.EditeventPin
			}
		}).then(function successCallback(response) {

			if (response.status == 200) {

				//Display edited event
				for (var i in $scope.events) {
					if ($scope.events[i].pk == $scope.EditeventPk) {
						$scope.events[i].name = $scope.EditeventName;
						$scope.events[i].description = $scope.EditeventDescription;
					}
				}
			}
			else {
				console.log(response.data);
				alert(response.data);
			}

		}, function errorCallback(response) {
			// Check for unique username and email
			if (response.data.username) {
				alert(response.data.username[0])
			}
			else if (response.data.email) {
				alert(response.data.email[0])
			}
			else {
				console.log(response.data);
			}
		});


	}

	$scope.deleteEvent = function (eventID) {
		// GET all events created by user
		$http({
			method: 'DELETE',
			url: 'https://photosharingapp-staging.appspot.com/api/events/' + $scope.events[eventID].pk,
			headers: {
				'Authorization': auth
			}
		}).then(function successCallback(response) {
			//Display deleted event
			for (var i in $scope.events) {
				if ($scope.events[i].pk == $scope.events[eventID].pk) {
					$scope.events.splice(i,1);
				}
			}
			console.log($scope.events)
		
		}, function errorCallback(response) {
			console.log(response)
		});
	}

// Simple Function for showing the logout button
$scope.showLogout = function () {
	document.getElementById('logoutButton').style.display = "block";
}

$scope.logout = function () {
	$window.location.href = '../';
	//document.getElementById('logoutButton').style.display = "none";
}


$scope.eventlink = function (event) {
	console.log(event.url_key)
	$window.location.href = './events?=' + event.url_key;
}
}]);