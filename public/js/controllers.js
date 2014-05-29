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

app.controller('BuilderCtrl', ['$scope', '$http', function($scope, $http) {

	$http.get('/app/templates', { cache: true }).success(function(data) {
		$scope.templates = data;

		$scope.temp = {
			id: 	  $scope.templates[0].id,
			template: $scope.templates[0].template
		};

		$scope.tempsLoaded = true;
	});

	$scope.changeTemplate = function(id) {
		for (var i = 0; i < $scope.templates.length; i++) {
			var item = $scope.templates[i];

			if (item.id === id) {
				$scope.temp.template = item.template;
				break;
			}
		}
	};

	$scope.doc = {
		template: '',
		font: '',
		name: 'Jack Toulemonde',
		address: '123 Queen Street West',
		phone: '(416) 555 1234',
		email: 'jtmonde@gmail.com',
		website: 'jtmonde.com',
		about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate non sem ut viverra. Curabitur at molestie mauris. Etiam eu est vel metus rhoncus consequat ut eget tortor. In metus risus, viverra in justo ac, facilisis volutpat ligula. In id est in quam hendrerit adipiscing et ac orci. Curabitur nunc eros, malesuada sit amet tincidunt blandit, tincidunt a neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ',
		education: 'Proin at aliquet nunc. Donec vitae tortor eu felis placerat facilisis ut consectetur nisi. Quisque ac massa erat. Ut a turpis interdum, viverra nunc a, faucibus felis. ',
		experience: 'Maecenas nisi purus, mollis ac quam at, posuere molestie nibh. Etiam et sem eu urna mollis ultricies.',
		skills: ['Web Development', 'JavaScript', 'PHP', 'RWD', 'Carpentry'],
		interests: 'Hiking and kayaking'
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
