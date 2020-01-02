loginRegisterModule.controller("loginRegisterController", ['$scope', '$http','$window','$cookies', function ($scope, $http, $window, $cookies) {

	$scope.title = "Login";

	// Creating constants representing the page state (either a login page or a register page)
	$scope.LOGIN = 0;
	$scope.REGISTER = 1;

	$scope.LoginOrRegister = $scope.LOGIN;

	// This function toggles the page between a login or a register page
	$scope.toggleLoginRegister = function () {
		// Switching to the Register UI
		if ($scope.LoginOrRegister == $scope.LOGIN) {
			$scope.title = "Register";
			document.getElementById('loginForm').style.display = "none";
			document.getElementById('registerForm').style.display = "block";
			document.getElementById('toggleLoginRegisterButton').innerHTML = "Already have an account? Login here.";

			// Indicating that the page is now in register mode
			$scope.LoginOrRegister = $scope.REGISTER;
		}
		// Switching to the Login UI
		else if ($scope.LoginOrRegister == $scope.REGISTER) {
			$scope.title = "Login";
			document.getElementById('loginForm').style.display = "block";
			document.getElementById('registerForm').style.display = "none";
			document.getElementById('toggleLoginRegisterButton').innerHTML = "Don't have an account? Register here.";

			// Indicating that the page is now in login mode
			$scope.LoginOrRegister = $scope.LOGIN;
		}
	}



	$scope.username = "";
	$scope.email = "";
	$scope.password = "";

	$scope.login_username = "";
	$scope.login_password = "";

	$scope.save = function (form) {
		if ($scope.LoginOrRegister == $scope.REGISTER) {
			//if (!$scope.contactForm.$valid) return;
			console.log("Register User Details" + $scope.username);
			$http({
				method: 'POST',
				url: 'https://photosharingapp-staging.appspot.com/api/users/',
				data: {
					"username": $scope.username,
					"email": $scope.email,
					"password": $scope.password
				}
			}).then(function successCallback(response) {
				// User created successfully
				if (response.status == 201) {
					alert('User created successfully');
					$window.location.href = './';
				}
				else {
					console.log(response.data);
				}

			}, function errorCallback(response) {
				// Check for unique username and email
				if(response.data.username){
					alert(response.data.username[0])
				}
				else if (response.data.email){
					alert(response.data.email[0])
				}
				else{
					console.log(response.data);
				}
			});
		}
		else if ($scope.LoginOrRegister == $scope.LOGIN) {
			//if (!$scope.contactForm.$valid) return;
			console.log("Login User Details" + $scope.login_username);
			// 
			$http({
				method: 'POST',
				url: 'https://photosharingapp-staging.appspot.com/api/token/',
				data: {
					"username": $scope.login_username,
					"password": $scope.login_password
				}
			}).then(function successCallback(response) {

				if (response.status == 200) {
					console.log(response.data);
					$cookies.put('Authorization',response.data.access);
					$cookies.put('Refresh', response.data.refresh);
					$window.location.href = './adminDashboard';
				}
				else {
					
					console.log(response.data)
				}

			}, function errorCallback(response) {
				alert(response.data["detail"])
				console.log(response.data)
			});
		}
	}
}]);