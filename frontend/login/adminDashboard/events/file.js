//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);


app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', '$http', function ($scope, Upload, $timeout, $http) {
    console.log('hi');

    $http({
		        method: 'GET',
		        url: '../../../storage'
		    }).then(function successCallback(response) {
                $scope.uploadVars = response.data;
                console.log($scope.uploadVars);
                
                // this callback will be called asynchronously
		        // when the response is available
		        // change to next url 
		        
		    }, function errorCallback(response) {
		        // called asynchronously if an error occurs
		        // or server returns response with an error status.
            });
        
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            //console.log(Date.now());
            file.upload = Upload.upload({
                url: 'https://photo_app_bucket.storage.googleapis.com',
                data: {
                  'key': $scope.uploadVars.cloud.key,
                  'bucket': $scope.uploadVars.cloud.bucket,
                  'GoogleAccessId': $scope.uploadVars.cloud.GoogleAccessId,
                  'policy': $scope.uploadVars.cloud.policy,
                  'signature': $scope.uploadVars.cloud.signature,
                  'Content-Type': 'image/jpeg',
                    file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        });
    }
}]);