app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl:  'templates/home.html',
		controller:   'HomeController',
		title: 		  'Home',
		requireLogin: false
	});

	$routeProvider.when('/account/sign-in', {
		templateUrl:  'templates/signin.html',
		controller:   'SigninController',
		title:        'Sign In',
		requireLogin: false
	});

	$routeProvider.when('/dashboard', {
		templateUrl:  'templates/dashboard.html',
		controller:   'DashboardController',
		title:        'Welcome',
		requireLogin: true
	});

	$routeProvider.otherwise({ redirectTo: '/' });
});


app.run(['$location', '$rootScope', 'AccountService', 'FlashService', function($location, $rootScope, AccountService, FlashService) {
	// *** to be fixed
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (next.requireLogin && !AccountService.isSignedIn())
			event.preventDefault();
	});

	// dynamic page title
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

		if (current.hasOwnProperty('$$route')) $rootScope.title = current.$$route.title;

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
			signin.success(FlashService.clear());
			signin.success(cacheSession);
			signin.error(signinError);
			
			return signin;
		},
		logout: function() {
			//var logout = $http.get("/auth/logout");
			//logout.success(uncacheSession);
			
			//return logout;
		},
		isSignedIn: function() {
			return SessionService.get('authenticated');
		}
	};
}]);


app.controller('HomeController', ['$scope', 'AccountService', function($scope, AccountService) {
	
	$scope.signedin = AccountService.isSignedIn();	

}]);


app.controller('SigninController', ['$scope', '$location', 'AccountService', function($scope, $location, AccountService) {
	
	$scope.credentials = {email: '', password: '', remember: ''};

	$scope.signin = function() {
		AccountService.signin($scope.credentials).success(function() {
			$location.path('/dashboard');
		});
	};
}]);


app.controller('DashboardController', ['$scope', function($scope) {
	


}]);
