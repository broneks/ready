//---------------------- //
//------ Services ------ //
//---------------------- //

//--- Flash ---//

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


//--- Session ---//

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


//--- Account ---//

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
