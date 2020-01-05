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
	$scope.togglePasswordInvalid='false';
	$scope.wrongCredential ='false';
	$scope.save = function (form) {

		if ($scope.LoginOrRegister == $scope.REGISTER) {

			
			// If the password is invalid then the form will not be submitted
			if($scope.verifyPassword($scope.password) == false){ 
				$scope.togglePasswordInvalid='true';
				return; }

			$scope.togglePasswordInvalid='false';
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
			
			$scope.wrongCredential='false';
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
				$scope.wrongCredential='true';
				//alert(response.data["detail"])
				console.log(response.data)
			});
		}
	}


		// This function confirms whether or not a password is valid and displays an appropriate message if not
	$scope.verifyPassword = function(password)
	{
		//This represents whether or not the given password is valid
		var isValid = true;

		// If the password is less than 8 chars then it is invalid
		if(password.length < 8){ isValid = false; }

		// If the password contains no digits then it is invalid
		if(password.search(/\d+/g) == -1){ isValid = false; }

		// If the password contains no letters then it is invalid
		if(password.search(/[a-z]|[A-Z]/g) == -1){ isValid = false; }

		// The password cannot be obvious
		if(password === "password123" || password === "123password"){ isValid = false; }

		// Displaying error message if the password is invalid
		//if(isValid == false){ document.getElementById('invalidPassword').style.display = "block"; }
		//else{ document.getElementById('invalidPassword').style.display = "none"; }

		return isValid;
	}

}]);