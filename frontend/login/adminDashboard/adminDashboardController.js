adminDashboardModule.controller("adminDashboardController", ['$scope', '$http', '$cookies', '$window', 'jwtHelper', function ($scope, $http, $cookies, $window, jwtHelper) {

	$scope.title = "Your Events";
	$scope.deleteEventID = 0;

	//Initialise Variable
	$scope.username = "";
	$scope.email = "";
	$scope.password = "";

	var bool = jwtHelper.isTokenExpired($cookies.get('Authorization'));
	console.log($cookies.get('Authorization'))
	if (bool) {
		$cookies.remove('Authorization');
		console.log("In Change cookies")
		$http({
			method: 'POST',
			url: 'https://photosharingapp-staging.appspot.com/api/token/refresh/',
			data: {
				"refresh": $cookies.get('Refresh'),
			}
		}).then(function successCallback(response) {
			console.log("Successfully getting a new token");
			$cookies.put('Authorization', response.data.access);
		}, function errorCallback(response) {
			console.log("Fail to change refresh token")
			// Check for unique username and email
			alert(response.data)
		});
	}


	console.log('After',$cookies.get('Authorization'));
	var auth = "Bearer " + $cookies.get('Authorization')
	console.log(auth)
	var tokenPayload = jwtHelper.decodeToken($cookies.get('Authorization'));
	$scope.userID = tokenPayload.user_id;
	// GET all events created by user with the refresh token
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
		alert(response.data["detail"])
		console.log(response.data)
	});

	// GET username from decrypted token
	$http({
		method: 'GET',
		url: 'https://photosharingapp-staging.appspot.com/api/users/' + $scope.userID,
		headers: {
			'Authorization': auth
		}
	}).then(function successCallback(response) {
		$scope.username = response.data.username;
		$scope.email = response.data.email;

	}, function errorCallback(response) {
		alert(response.data["detail"])
		console.log(response.data)
	});


	$scope.editUserDetails = function () {
		$http({
			method: 'PUT',
			url: 'https://photosharingapp-staging.appspot.com/api/users/' + $scope.userID,
			headers: {
				'Authorization': auth
			},
			data: {
				"username": $scope.username,
				"email": $scope.email,
				"password": $scope.password
			}
		}).then(function successCallback(response) {
			console.log(response.data)

			if (response.status == 200) {
				console.log(response.data)
			}
			else {
				console.log(response.data);
				alert(response.data);
			}

		}, function errorCallback(response) {
		});

	}


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
		console.log($scope.events[eventID].date);
		document.getElementById('eventIsActive').checked = $scope.events[eventID].active;
		document.getElementById('eventPin').value = $scope.events[eventID].pin;
		document.getElementById('eventDescription').value = $scope.events[eventID].description;
		document.getElementById('eventLocation').value = $scope.events[eventID].location;
	}

	// This function will make a request to the back end to create a new event
	$scope.createEvent = function () {
		// Change to format Jan 01 2020
		$scope.date = $scope.eventDate.toString().substr(4, 11);
		$http({
			method: 'POST',
			url: 'https://photosharingapp-staging.appspot.com/api/events/',
			headers: {
				'Authorization': auth
			},
			data: {
				"name": $scope.eventName,
				"description": $scope.eventDescription,
				"date": $scope.date,
				"password": $scope.eventPin
			}
		}).then(function successCallback(response) {

			if (response.status == 201) {
				console.log(response)
				//alert('Event created successfully');
				$scope.events.push({
					name: $scope.eventName,
					description: $scope.eventDescription,
					date: $scope.date,
					pk: response.data.pk,
					url_key: response.data.url_key
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
		$scope.qr_url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href + 'events/?=' + event.url_key + '&size=500x500'
		// Gemerate QR code
		$http({
			method: 'GET',
			url: $scope.qr_url
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

	$scope.getEventID = function (eventID) {
		console.log(eventID)
		$scope.deleteEventID = eventID;
	}

	$scope.deleteEvent = function () {
		console.log($scope.events[$scope.deleteEventID].pk)
		// GET all events created by user
		$http({
			method: 'DELETE',
			url: 'https://photosharingapp-staging.appspot.com/api/events/' + $scope.events[$scope.deleteEventID].pk,
			headers: {
				'Authorization': auth
			}
		}).then(function successCallback(response) {
			//Display deleted event
			for (var i in $scope.events) {
				if ($scope.events[i].pk == $scope.events[$scope.deleteEventID].pk) {
					$scope.events.splice(i, 1);
				}
			}

		}, function errorCallback(response) {
			console.log(response)
			alert(response.data)
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