

eventPageModule.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);



eventPageModule.controller("eventPageController", ['$scope', '$http', '$cookies','jwtHelper', '$window', function ($scope, $http, $cookies, jwtHelper, $window) {

	// These variables hold information relevant to the fullscreen functionality
	$scope.fullscreenPhotoURL = "";
	$scope.fullscreenDate = "";
	$scope.fullscreenDescription = "";
	$scope.fullscreenUploadedBy = "";
	$scope.currentFullscreenPhoto = 0;

	// These constants represent which direction the user is browsing the photos in (for the switchPhoto function)
	$scope.LEFT = 0;
	$scope.RIGHT = 1;

	// Preloading event details and photos with dummy data
	$scope.eventDetails =
		{
			name: "",
			date: "",
			location: "",
			description: ""
		};

	// Initiate variable 
	$scope.nickname = " ";
	$scope.photos = [];
	// Get URL_KEY:
	$scope.url_key = window.location.search.substring(2)
	// Check whether is admin 
	if ($cookies.get('Authorization')) {
		$scope.admin = 'true';
		// Check token expiration and renew if expired
		var bool = jwtHelper.isTokenExpired($cookies.get('Authorization'));
		if (bool){
			$cookies.remove('Authorization'); 
			$http({
				method: 'POST',
				url: 'https://photosharingapp-staging.appspot.com/api/token/refresh/',
				data: {
					"refresh": $cookies.get('Refresh'),
				}
			}).then(function successCallback(response) {
				$cookies.put('Authorization', response.data.access);
			});
		}
		

		var auth = "Bearer " + $cookies.get('Authorization')
		var tokenPayload = jwtHelper.decodeToken($cookies.get('Authorization'));
		$scope.userID = tokenPayload.user_id;
		//Set nickname as admin
		$http({
			method: 'GET',
			url: 'https://photosharingapp-staging.appspot.com/api/users/' + $scope.userID,
			headers: {
				'Authorization': auth
			}
		}).then(function successCallback(response) {
			$scope.nickname = response.data.username;
			console.log($scope.nickname)
		}, function errorCallback(response) {
			alert(response.data["detail"])
			console.log(response.data)
		});

	}
	else {
		$scope.admin = 'false';
		// Show modal to get public's username 
		$(document).ready(function () {
			$('#myModal').modal('show');
		});
	}


	// Get event details and images 	
	$http({
		method: 'GET',
		url: 'https://photosharingapp-staging.appspot.com/api/event/' + $scope.url_key
	}).then(function successCallback(response) {
		$scope.eventDetails.name = response.data.name;
		$scope.eventDetails.location = response.data.location;
		$scope.eventPk = response.data.pk;
		console.log(response.data)
		if ((response.data.event_images.objects.length != 0)) {
			for (var i = 0; i < response.data.event_images.objects.length; i++) {
				$scope.photos.push({
					URL: response.data.event_images.objects[i].image,
					likes: response.data.event_images.objects[i].likes,
					date: response.data.event_images.objects[i].uploaded_at,
					uploadedBy: response.data.event_images.objects[i].nickname,
					pk: response.data.event_images.objects[i].pk,
				})
			}
		}
		console.log($scope.photos)


	}, function errorCallback(response) {

	});

	$scope.uploadFile = function () {
		var file = $scope.myFile;
		console.log('file is '); console.dir(file);
		var uploadUrl = "https://photosharingapp-staging.appspot.com/api/upload_image/";
		var fd = new FormData();
		fd.append('image', file);
		fd.append('event', $scope.eventPk);
		fd.append('nickname', $scope.nickname)
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		})
			.then(function successCallback(response) {
				$scope.photos.push({
					URL: response.data.image,
					likes: response.data.likes,
					date: response.data.uploaded_at,
					uploadedBy: response.data.nickname,
					pk: response.data.pk,
				})
				console.log(response.data);
				alert("Your picture has been uplaoded successfully.")
			},
				function errorCallback(response) {
					console.log(response.data);
				});
	};


	// This method should retrieve event details from the backend database
	$scope.retrieveEventDetails = function () {
	}

	// This method should retrieve details of each photo from the backend database and store them in the photos object array
	$scope.retrievePhotos = function () {
	}

	// This function makes a specified photo fill the screen when the user clicks on it
	$scope.fullscreenPhoto = function (photoNumber) {
		// Assigning URL, date, description, and author of selected image to the fullscreen image text
		$scope.fullscreenPhotoURL = $scope.photos[photoNumber].URL;
		$scope.fullscreenDate = $scope.photos[photoNumber].date;
		$scope.fullscreenUploadedBy = $scope.photos[photoNumber].uploadedBy;
		$scope.fullscreenlikes = $scope.photos[photoNumber].likes;
		// Recording which image is in fullscreen (for later when the user clicks left and right arrows)
		$scope.currentFullscreenPhoto = photoNumber;

		// Making the fullscreen image UI visible
		document.getElementById("fullscreenPhotoContainer").style.display = "block";
	}

	$scope.closeFullscreen = function () {
		// Making the fullscreen image UI hidden
		document.getElementById("fullscreenPhotoContainer").style.display = "none";
	}

	$scope.downloadAll = function () {
		var zip = new JSZip();
		var img = zip.folder($scope.eventDetails.name)
		if (($scope.photos.length != 0)) {
			for (var i = 0; i < $scope.photos.length; i++) {
				img.file($scope.photos[i].URL, imgData, { base64: true });
			}
		}
		// Generate the zip file asynchronously
		zip.generateAsync({ type: "blob" })
			.then(function (content) {
				// Force down of the Zip file
				saveAs(content, "archive.zip");
			});
	}

	// Functions for opening and closing the photo info dialog
	$scope.showInfo = function () {
		document.getElementById('photoInfo').style.display = "block";
	}
	$scope.closeInfo = function () {
		document.getElementById('photoInfo').style.display = "none";
	}

	$scope.sortImage = function () {
		$scope.photos = [];
		// Get event details and images 	
		$http({
			method: 'GET',
			url: 'https://photosharingapp-staging.appspot.com/api/event/' + $scope.url_key
		}).then(function successCallback(response) {
			$scope.eventDetails.name = response.data.name;
			$scope.eventDetails.location = response.data.location;
			$scope.eventPk = response.data.pk;
			console.log(response.data)
			if ((response.data.event_images.objects.length != 0)) {
				for (var i = 0; i < response.data.event_images.objects.length; i++) {
					$scope.photos.push({
						URL: response.data.event_images.objects[i].image,
						likes: response.data.event_images.objects[i].likes,
						date: response.data.event_images.objects[i].uploaded_at,
						uploadedBy: response.data.event_images.objects[i].nickname,
						pk: response.data.event_images.objects[i].pk,
					})
				}
			}
			console.log($scope.photos)


		}, function errorCallback(response) {

		});
	}

	// This method updates the like count in the database containing the row representing the liked picture
	$scope.sendLike = function () {
		console.log($scope.photos[$scope.currentFullscreenPhoto].pk);

		$http({
			method: 'PUT',
			url: 'https://photosharingapp-staging.appspot.com/api/interact_media/',
			data: {
				"image_id": $scope.photos[$scope.currentFullscreenPhoto].pk
			}
		}).then(function successCallback(response) {

			if (response.status == 200) {
				$scope.photos[$scope.currentFullscreenPhoto].likes += 1;
				$scope.fullscreenlikes = $scope.photos[$scope.currentFullscreenPhoto].likes;
				console.log($scope.photos[$scope.currentFullscreenPhoto].likes);
			}
			else {
				console.log(response.data);
				alert(response.data);
			}

		}, function errorCallback(response) {
		});
	}

	// Download individual picture 
	$scope.downloadImage = function ($index) {
		console.log($index)
		console.log($scope.photos[$index].URL)
		// Get event details and images 	
		$http({
			method: 'GET',
			url: $scope.photos[$index].URL,
			responseType: "arraybuffer"
		}).then(function successCallback(response) {
			var anchor = angular.element('<a/>');
			var blob = new Blob([response.data]);
			anchor.attr({
				href: window.URL.createObjectURL(blob),
				target: '_blank',
				download: 'fileName.jpg'
			})[0].click();
		}, function errorCallback(response) {
			alert(response.data)
		});
	}

	$scope.getImageID = function ($index) {
		$scope.deleteEventID = $index;
	}

	$scope.deleteImage = function () {
		// GET all events created by user
		if (auth) {
			$http({
				method: 'DELETE',
				url: 'https://photosharingapp-staging.appspot.com/api/delete_image/' + $scope.photos[$scope.deleteEventID].pk,
				headers: {
					'Authorization': auth
				}
			}).then(function successCallback(response) {
				//Display deleted image
				for (var i in $scope.photos) {
					if ($scope.photos[i].pk == $scope.photos[$scope.deleteEventID].pk) {
						$scope.photos.splice(i, 1);
					}
				}

			}, function errorCallback(response) {
				console.log(response.data)
				alert(response.data)
			});
		}
		else {
			alert("Only Event Organisers can delete photos.")
		}
	}

	// This function changes the fullscreen photo on display, depending on which direction the user is browsing	
	$scope.switchPhoto = function (leftOrRight) {
		if (leftOrRight == $scope.RIGHT && $scope.currentFullscreenPhoto < $scope.photos.length - 1) {
			$scope.currentFullscreenPhoto = $scope.currentFullscreenPhoto + 1;
			// Assigning URL, date, description, and author of selected image to the fullscreen image text
			$scope.fullscreenPhotoURL = $scope.photos[$scope.currentFullscreenPhoto].URL;
			$scope.fullscreenDate = $scope.photos[$scope.currentFullscreenPhoto].date;
			$scope.fullscreenUploadedBy = $scope.photos[$scope.currentFullscreenPhoto].uploadedBy;
			$scope.fullscreenlikes = $scope.photos[$scope.currentFullscreenPhoto].likes;
		}
		if (leftOrRight == $scope.LEFT && $scope.currentFullscreenPhoto > 0) {
			$scope.currentFullscreenPhoto = $scope.currentFullscreenPhoto - 1;

			// Assigning URL, date, description, and author of selected image to the fullscreen image text
			$scope.fullscreenPhotoURL = $scope.photos[$scope.currentFullscreenPhoto].URL;
			$scope.fullscreenDate = $scope.photos[$scope.currentFullscreenPhoto].date;
			$scope.fullscreenUploadedBy = $scope.photos[$scope.currentFullscreenPhoto].uploadedBy;
			$scope.fullscreenlikes = $scope.photos[$scope.currentFullscreenPhoto].likes;
		}
	}

	$scope.logout = function () {
		$window.location.href = '../../';
	}

}]);