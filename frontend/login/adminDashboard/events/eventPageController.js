

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

eventPageModule.filter('startFrom', function () {
	console.log('At filter')
	return function (input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}
});



eventPageModule.controller("eventPageController", ['$scope', '$http', '$cookies', 'jwtHelper', '$window', function ($scope, $http, $cookies, jwtHelper, $window) {

	// These variables hold information relevant to the fullscreen functionality
	$scope.fullscreenPhotoURL = "";
	$scope.fullscreenDate = "";
	$scope.fullscreenDescription = "";
	$scope.fullscreenUploadedBy = "";
	$scope.currentFullscreenPhoto = 0;
	// These constants represent which direction the user is browsing the photos in (for the switchPhoto function)
	$scope.LEFT = 0;
	$scope.RIGHT = 1;
	// Pagination
	$scope.pageSize = 10;
	$scope.currentPage = 0;
	$scope.photos=[];
	$scope.numberOfPages = function () {
		if(Math.ceil($scope.photos.length / $scope.pageSize)==0){
			return 1;
		}
		else{
			return Math.ceil($scope.photos.length / $scope.pageSize);
		}
	}

	// Preloading event details and photos with dummy data
	$scope.eventDetails =
		{
			name: "",
			date: "",
			location: "",
			description: ""
		};

	var self = this;
	// Initiate variable
	$scope.nickname = " ";
	// Get URL_KEY:
	$scope.url_key = window.location.search.substring(3);


	self.setAdminNickname = function () {

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
	// Check whether is admin
	if ($cookies.get('Authorization')) {
		$scope.admin = 'true';
		// Check token expiration and renew if expired
		var bool = jwtHelper.isTokenExpired($cookies.get('Authorization'));
		if (bool) {
			$cookies.remove('Authorization');
			$http({
				method: 'POST',
				url: 'https://photosharingapp-staging.appspot.com/api/token/refresh/',
				data: {
					"refresh": $cookies.get('Refresh'),
				}
			}).then(function successCallback(response) {
				$cookies.put('Authorization', response.data.access);
				self.setAdminNickname();
			}, function errorCallback(response) {
				console.log("Fail to change refresh token")
				// Check for unique username and email
				alert(response.data)
			});
		}
		else {
			self.setAdminNickname();
		}
	}
	else {
		$scope.admin = 'false';
		// Show modal to get public's username
		$(document).ready(function () {
			$('#myModal').modal('show');
		});
	}


	// This method should retrieve details of each photo from the backend database and store them in the photos object array
	this.getImages = function () {
		$scope.photos = [];

		$http({
			method: 'GET',
			url: 'https://photosharingapp-staging.appspot.com/api/event/' + $scope.url_key
		}).then(function successCallback(response) {
			$scope.eventDetails.name = response.data.name;
			$scope.eventDetails.location = response.data.location;
			$scope.eventDetails.description = response.data.description;
			$scope.eventPk = response.data.pk;
			$scope.totalUser = [];
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
					$scope.totalUser.push(response.data.event_images.objects[i].nickname)
				}
			}
			// Get more pictures if >10
			if (response.data.event_images.meta.next != null) {
				self.getMoreImages(response.data.event_images.meta.next)
			}
			else {
				// Count Distint Users
				$scope.distinctUserCount = [... new Set($scope.totalUser)].length;
				console.log($scope.photos)
			}

		}, function errorCallback(response) {
			alert(response.data);
		});
	}


	this.getMoreImages = function (nextImageUrl) {
		$http({
			method: 'GET',
			url: nextImageUrl
		}).then(function successCallback(response) {
			if ((response.data.event_images.objects.length != 0)) {
				for (var i = 0; i < response.data.event_images.objects.length; i++) {
					$scope.photos.push({
						URL: response.data.event_images.objects[i].image,
						likes: response.data.event_images.objects[i].likes,
						date: response.data.event_images.objects[i].uploaded_at,
						uploadedBy: response.data.event_images.objects[i].nickname,
						pk: response.data.event_images.objects[i].pk,
					})
					$scope.totalUser.push(response.data.event_images.objects[i].nickname)
				}
			}
			if (response.data.event_images.meta.next != null) {
				self.getMoreImages(response.data.event_images.meta.next)
			}
			else {
				// Count Distint Users
				$scope.distinctUserCount = [... new Set($scope.totalUser)].length;
				console.log($scope.photos)
			}
		}, function errorCallback(response) {
			alert(response.data)
		});
	}

	this.getMoreImagesWithPin = function (nextImageUrl) {
		$http({
			method: 'POST',
			url: nextImageUrl,		
			data: {
				"password": $scope.pin,
			}
		}).then(function successCallback(response) {
			if ((response.data.event_images.objects.length != 0)) {
				for (var i = 0; i < response.data.event_images.objects.length; i++) {
					$scope.photos.push({
						URL: response.data.event_images.objects[i].image,
						likes: response.data.event_images.objects[i].likes,
						date: response.data.event_images.objects[i].uploaded_at,
						uploadedBy: response.data.event_images.objects[i].nickname,
						pk: response.data.event_images.objects[i].pk,
					})
					$scope.totalUser.push(response.data.event_images.objects[i].nickname)
				}
			}
			if (response.data.event_images.meta.next != null) {
				self.getMoreImagesWithPin(response.data.event_images.meta.next)
			}
			else {
				// Count Distint Users
				$scope.distinctUserCount = [... new Set($scope.totalUser)].length;
				console.log($scope.photos)
			}
		}, function errorCallback(response) {
			alert(response.data)
		});
	}

		// Check whether is a private event
		if(window.location.search.substring(2,3)=='p'){
			$(document).ready(function () {
				$('#getPin').modal('show');
			});

		}
		else{
			self.getImages();
		}
	
	$scope.getImagesWithPin = function (){
		$scope.photos = [];

		$http({
			method: 'POST',
			url: 'https://photosharingapp-staging.appspot.com/api/event/' + $scope.url_key,
			data: {
				"password": $scope.pin,
			}
		}).then(function successCallback(response) {
			$scope.eventDetails.name = response.data.name;
			$scope.eventDetails.location = response.data.location;
			$scope.eventDetails.description = response.data.description;
			$scope.eventPk = response.data.pk;
			$scope.totalUser = [];
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
					$scope.totalUser.push(response.data.event_images.objects[i].nickname)
				}
			}
			// Get more pictures if >10
			if (response.data.event_images.meta.next != null) {
				self.getMoreImagesWithPin(response.data.event_images.meta.next)
			}
			else {
				// Count Distint Users
				$scope.distinctUserCount = [... new Set($scope.totalUser)].length;
				console.log($scope.photos)
			}

		}, function errorCallback(response) {
			alert(response.data['detail']);
		});
	}


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
			},
				function errorCallback(response) {
					console.log(response.data);
				});
	};


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
		$scope.currentPage = 0;
				// Check whether is a private event
				if(window.location.search.substring(2,3)=='p'){
					$scope.getImagesWithPin();
				}
				else{
					self.getImages();
				}
	}

	// This method updates the like count in the database containing the row representing the liked picture
	$scope.sendLikeFullScreen = function () {
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
			}
			else {
				console.log(response.data);
				alert(response.data);
			}

		}, function errorCallback(response) {
		});
	}

		// This method updates the like count in the database containing the row representing the liked picture
		$scope.sendLike = function ($index) {
			$http({
				method: 'PUT',
				url: 'https://photosharingapp-staging.appspot.com/api/interact_media/',
				data: {
					"image_id": $scope.photos[$index].pk
				}
			}).then(function successCallback(response) {
	
				if (response.status == 200) {
					$scope.photos[$index].likes += 1;
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