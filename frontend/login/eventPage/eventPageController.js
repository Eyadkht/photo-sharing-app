eventPageModule.controller("eventPageController", function($scope){
	
	// These variables hold information relevant to the fullscreen functionality
	$scope.fullscreenPhotoURL = "";
	$scope.fullscreenDate = "";
	$scope.fullscreenDescription = "";
	$scope.fullscreenUploadedBy = "";
	$scope.currentFullscreenPhoto = 0;
	
	
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
			URL: "https://news.images.itv.com/image/file/2067939/stream_img.jpg"},
	];
	
	// This method should retrieve event details from the backend database
	$scope.retrieveEventDetails = function()
	{
	}

	// This method should retrieve details of each photo from the backend database
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
	
	$scope.uploadPhotos = function()
	{
	}

});