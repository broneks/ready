app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		controller:  'HomeController',
		title: 		 'Home',
		requireAuth: false
	});

	$routeProvider.when('/account/sign-in', {
		templateUrl: 'templates/signin.html',
		controller:  'SigninController',
		title:       'Sign In',
		requireAuth: false
	});

	$routeProvider.when('/account/sign-out', {
		template:    '<p>Signing Out...</p>',
		controller:  'SignoutController',
		title:       'Signing Out',
		requireAuth: true
	});

	$routeProvider.when('/dashboard', {
		templateUrl: 'templates/dashboard.html',
		controller:  'DashboardController',
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


app.factory('FlashService', ['$rootScope', function($rootScope) {
	return {
		show: function(message) {
			$rootScope.flash = message;
		},
		clear: function() {
			$rootScope.flash = '';
		}
	};
}]);


app.factory("SessionService", function() {
	return {
		get: function(key) {
			return sessionStorage.getItem(key);
		},
		set: function(key, val) {
			return sessionStorage.setItem(key, val);
		},
		unset: function(key) {
			return sessionStorage.removeItem(key);
		}
	}
});


app.factory('AccountService', ['$http', '$location', '$sanitize', 'TOKEN', 'FlashService', 'SessionService', function($http, $location, $sanitize, TOKEN, FlashService, SessionService) {

	var sanitize = function(credentials) {
		var remember = (credentials.remember) ? true : false;

		return {
			email: $sanitize(credentials.email),
			password: $sanitize(credentials.password),
			remember: remember,
			csrf_token: TOKEN
		};
	};

	var cacheSession = function() {
		SessionService.set('authenticated', true);
	};

	var uncacheSession = function() {
		SessionService.unset('authenticated');
	};

	var signinError = function(response) {
		FlashService.show(response);
	};

	return {
		signin: function(credentials) {

			var signin = $http.post('/account/sign-in', sanitize(credentials));
			signin.success(cacheSession);
			signin.success(FlashService.clear());
			signin.error(signinError);
			
			return signin;
		},
		signout: function() {

			var signout = $http.get('/account/sign-out');
			signout.success(uncacheSession);

			return signout;
		},
		isSignedIn: function() {

			return SessionService.get('authenticated');
		}
	};
}]);


app.controller('SigninController', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {
	
	$scope.credentials = {email: '', password: '', remember: ''};

	$scope.signin = function() {
		AccountService.signin($scope.credentials).success(function() {
			$location.path('/dashboard');
		});
	};
}]);


app.controller('RegisterController', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {

	

}]);


app.controller('SignoutController', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {

	if (AccountService.isSignedIn()) {
		AccountService.signout().success(function() {
			$location.path('/');
		});
	}
}]);


app.controller('HomeController', ['$scope', function($scope) {
	


}]);


app.controller('DashboardController', ['$scope', 'AccountService', 'user', function($scope, AccountService, user) {
	
	$scope.user = user.data;
}]);
