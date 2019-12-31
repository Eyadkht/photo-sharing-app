eventPageModule.controller("eventPageController", function($scope){
	
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
		name: "Birthday Photos",
		date: "02-04-2020",
		location: "Westminster, London, UK",
		description: "Lorem ipsum dolor sit amet consectetur elit ..."
	};
	
	$scope.photos =
	[
		{
			uploadedBy: "John",
			date: "31-12-2019",
			description: "This is a new years eve party, etc ...",
			URL: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?cs=srgb&dl=altitude-clouds-cold-417173.jpg&fm=jpg"},
		 {
			uploadedBy: "David",
			date: "25-12-2019",
			description: "This is a Christmas party, etc ...",
			URL: "https://media-live.jmldirect.com/catalog/product/cache/207e23213cf636ccdef205098cf3c8a3/t/r/tree_dazzler_01_1.jpg"},
		 
		 {
			uploadedBy: "Craig",
			date: "20-06-2020",
			description: "This is a summer event, etc ...",
			URL: "https://news.images.itv.com/image/file/2067939/stream_img.jpg"}
	];
	
	// This method should retrieve event details from the backend database
	$scope.retrieveEventDetails = function()
	{
	}

	// This method should retrieve details of each photo from the backend database and store them in the photos object array
	$scope.retrievePhotos = function()
	{
	}
	
	// This function makes a specified photo fill the screen when the user clicks on it
	$scope.fullscreenPhoto = function(photoNumber)
	{
		// Assigning URL, date, description, and author of selected image to the fullscreen image text
		$scope.fullscreenPhotoURL = $scope.photos[photoNumber].URL;
		$scope.fullscreenDate = $scope.photos[photoNumber].date;
		$scope.fullscreenDescription = $scope.photos[photoNumber].description;
		$scope.fullscreenUploadedBy = $scope.photos[photoNumber].uploadedBy;
		
		// Recording which image is in fullscreen (for later when the user clicks left and right arrows)
		$scope.currentFullscreenPhoto = photoNumber;

		// Making the fullscreen image UI visible
		document.getElementById("fullscreenPhotoContainer").style.display="block";
	}
	
	$scope.closeFullscreen = function()
	{
		// Making the fullscreen image UI hidden
		document.getElementById("fullscreenPhotoContainer").style.display="none";
	}
	
	$scope.downloadAll = function()
	{
	}
	
	// Functions for opening and closing the photo info dialog
	$scope.showInfo = function()
	{
		document.getElementById('photoInfo').style.display = "block";
	}
	$scope.closeInfo = function()
	{
		document.getElementById('photoInfo').style.display = "none";
	}

	// This method updates the like count in the database containing the row representing the liked picture
	$scope.sendLike = function()
	{
		alert("You liked picture " + $scope.currentFullscreenPhoto);
	}

	// This function changes the fullscreen photo on display, depending on which direction the user is browsing	
	$scope.switchPhoto = function(leftOrRight)
	{
		if(leftOrRight == $scope.RIGHT && $scope.currentFullscreenPhoto < $scope.photos.length-1)
		{
			$scope.currentFullscreenPhoto = $scope.currentFullscreenPhoto + 1;
			
			// Assigning URL, date, description, and author of selected image to the fullscreen image text
			$scope.fullscreenPhotoURL = $scope.photos[$scope.currentFullscreenPhoto].URL;
			$scope.fullscreenDate = $scope.photos[$scope.currentFullscreenPhoto].date;
			$scope.fullscreenDescription = $scope.photos[$scope.currentFullscreenPhoto].description;
			$scope.fullscreenUploadedBy = $scope.photos[$scope.currentFullscreenPhoto].uploadedBy;
		}
		if(leftOrRight == $scope.LEFT && $scope.currentFullscreenPhoto > 0)
		{
			$scope.currentFullscreenPhoto = $scope.currentFullscreenPhoto - 1;
			
			// Assigning URL, date, description, and author of selected image to the fullscreen image text
			$scope.fullscreenPhotoURL = $scope.photos[$scope.currentFullscreenPhoto].URL;
			$scope.fullscreenDate = $scope.photos[$scope.currentFullscreenPhoto].date;
			$scope.fullscreenDescription = $scope.photos[$scope.currentFullscreenPhoto].description;
			$scope.fullscreenUploadedBy = $scope.photos[$scope.currentFullscreenPhoto].uploadedBy;
		}
	}

});