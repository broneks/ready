//-------------------------//
//------ Controllers ------//
//-------------------------//


//--- Home ---//

app.controller('HomeCtrl', ['$scope', function($scope) {
	


}]);


//--- Dashboard ---//

app.controller('DashboardCtrl', ['$scope', '$http', 'AccountService', function($scope, $http, AccountService, user) {
	
	$http.get('/account/user', { cache: true }).success(function(data) { 
		$scope.user = data.username; 
	});

}]);


//--- Resume Builder ---//

app.controller('BuilderCtrl', ['$scope', function($scope) {

	$scope.templates = [];

	$scope.fonts = [];

	$scope.doc = {
		template: '',
		font: '',
		name: '',
		address: '',
		email: '',
		phone: '',
		education: '',
		employment: '',
		skills: [],
		interests: ''
	};

}]);




//--- Register ---//

app.controller('RegisterCtrl', ['$scope', '$location', 'AccountService', 'FlashService', function($scope, $location, AccountService, FlashService) {

	$scope.details = {email: '', username: '', password: '', password_again: ''};

	$scope.register = function() {
		AccountService.register($scope.details).success(function(data) {
			$location.path('/');
			FlashService.show(data);
		});
	};

}]);


//--- Sign In ---//

app.controller('SigninCtrl', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {
	
	$scope.credentials = {email: '', password: '', remember: ''};

	$scope.signin = function() {
		AccountService.signin($scope.credentials).success(function() {
			$location.path('/app/dashboard');
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
