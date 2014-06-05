//-------------------------//
//------ Controllers ------//
//-------------------------//


//--- Home ---//

app.controller('HomeCtrl', ['$scope', function($scope) {
	


}]);


//--- Dashboard ---//

app.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {

	if (!jQuery('script[src="http://platform.linkedin.com/in.js"]').length) jQuery('<script type="text/javascript" src="http://platform.linkedin.com/in.js">api_key: 77noaiszyyly3g \n onLoad: onLinkedInLoad \n authorize: true \n </script>').appendTo('body');

	// get user
	$http.get('/account/user', { cache: true }).success(function(data) { 
		$scope.user = data.username; 
	});
}]);


//--- Resume Builder ---//

app.controller('BuilderCtrl', ['$scope', '$rootScope', '$http', 'localStorageService', function($scope, $rootScope, $http, localStorageService) {
	
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

	if (!$scope.doc && localStorageService.get('linkedin')) {

		var l = localStorageService.get('linkedin');

		$scope.doc = {
			template: 	'',
			font: 		'',
			name: 		l.formattedName,
			address: 	'',
			phone: 		'',
			email: 		'',
			website: 	'',
			about: 		l.summary,
			education: 	'',
			experience: '',
			skills: 	[],
			interests: 	''
		};

	} else {
		$scope.doc = {
			template: 	'',
			font: 		'',
			name: 		'',
			address: 	'',
			phone: 		'',
			email: 		'',
			website: 	'',
			about: 		'',
			education: 	'',
			experience: '',
			skills: 	[],
			interests: 	''
		};
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

app.controller('SignoutCtrl', ['$scope', '$location', 'AccountService', 'localStorageService', function($scope, $location, AccountService, localStorageService) {

	if (AccountService.isSignedIn()) {
		AccountService.signout().success(function() {
			// remove linkedin iframe and script from DOM
			jQuery('iframe, script[src="http://platform.linkedin.com/in.js"]').remove();

			// *** UN-COMMENT LATER ***
			// localStorageService.clearAll();

			$location.path('/');
		});
	}
}]);
