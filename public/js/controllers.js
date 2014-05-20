//-------------------------//
//------ Controllers ------//
//-------------------------//

//--- Home ---//

app.controller('HomeCtrl', ['$scope', function($scope) {
	


}]);


//--- Dashboard ---//

app.controller('DashboardCtrl', ['$scope', 'AccountService', 'user', function($scope, AccountService, user) {
	
	$scope.user = user.data;

}]);




//--- Register ---//

app.controller('RegisterCtrl', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {

	

}]);


//--- Sign In ---//

app.controller('SigninCtrl', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {
	
	$scope.credentials = {email: '', password: '', remember: ''};

	$scope.signin = function() {
		AccountService.signin($scope.credentials).success(function() {
			$location.path('/dashboard');
		});
	};
}]);


//--- Sign Out ---//

app.controller('SignoutCtrl', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {

	if (AccountService.isSignedIn()) {
		AccountService.signout().success(function() {
			$location.path('/');
		});
	}
}]);
