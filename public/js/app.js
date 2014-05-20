//-----------//
//--- App ---//
//-----------//

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		controller:  'HomeCtrl',
		title: 		 'Home',
		requireAuth: false
	});

	$routeProvider.when('/account/sign-in', {
		templateUrl: 'templates/signin.html',
		controller:  'SigninCtrl',
		title:       'Sign In',
		requireAuth: false
	});

	$routeProvider.when('/account/sign-out', {
		template:    '<p>Signing Out...</p>',
		controller:  'SignoutCtrl',
		title:       'Signing Out',
		requireAuth: true
	});

	$routeProvider.when('/dashboard', {
		templateUrl: 'templates/dashboard.html',
		controller:  'DashboardCtrl',
		title:       'Welcome to Your Dashboard',
		requireAuth: true,
		resolve: {
			user: function($http) {
				return $http.get('/account/user');
			}
		}
	});

	$routeProvider.otherwise({ redirectTo: '/' });
});


app.run(['$location', '$rootScope', 'AccountService', 'FlashService', function($location, $rootScope, AccountService, FlashService) {
	
	$rootScope.signedIn = AccountService.isSignedIn();

	// Block unauthenticated users from pages that require auth
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (next.requireAuth && !AccountService.isSignedIn()) {

			event.preventDefault();
			//FlashService.show("{'error': 'Please log in to continue.'}");
			$location.path('/');
		
		}
		return false;
	});

	// Set page title dynamically
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

		$rootScope.signedIn = AccountService.isSignedIn();

		FlashService.clear();

		if (current.hasOwnProperty('$$route')) 
			$rootScope.title = current.$$route.title;

	});
}]);
