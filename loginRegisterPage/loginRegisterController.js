loginRegisterModule.controller("loginRegisterController", function($scope){
	
	$scope.title = "Login";
	
	// Creating constants representing the page state (either a login page or a register page)
	$scope.LOGIN = 0;
	$scope.REGISTER = 1;
	
	$scope.LoginOrRegister = $scope.LOGIN;
	
	// This function toggles the page between a login or a register page
	$scope.toggleLoginRegister = function()
	{	
		$scope.title = "Register";
		document.getElementById('loginRegisterSubmit').value="Register";
	}
});