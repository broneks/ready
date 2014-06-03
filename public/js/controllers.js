//-------------------------//
//------ Controllers ------//
//-------------------------//


//--- Home ---//

app.controller('HomeCtrl', ['$scope', function($scope) {
	


}]);


//--- Dashboard ---//

app.controller('DashboardCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	
	$http.get('/account/user', { cache: true }).success(function(data) { 
		$scope.user = data.username; 
	});

	// note: refreshing resume builder page messes up rootscope data ***

	// getting linkedin profile data
	$scope.getLinkedInData = function() {
		if (!$rootScope.hasOwnProperty('linkedin')) {
			IN.API.Profile('me')
				.fields(['formatted-name','industry','headline','summary','educations','positions','skills'])
      			.result(function(result) {

      				$rootScope.$apply(function() {
      					var linkedin = result.values[0];
      					$rootScope.linkedin = linkedin;

      					console.log($rootScope.linkedin);
      				});
      			});
		}
	};

}]);


//--- Resume Builder ---//

app.controller('BuilderCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {

	console.log($rootScope.linkedin);

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
		name: '',
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

	// quick test
	if ($rootScope.linkedin) {
		$scope.doc.name = $rootScope.linkedin.formattedName;
	}

}]);


//--- Job Matcher ---//

app.controller('MatcherCtrl', ['$scope', function($scope) {
	


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
