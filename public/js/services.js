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

app.factory('SessionService', function() {
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
	};
});


//--- Account ---//

app.factory('AccountService', ['$http', '$location', 'TOKEN', 'FlashService', 'SessionService', function($http, $location, TOKEN, FlashService, SessionService) {

	var cacheSession = function() {
		SessionService.set('authenticated', true);
	};

	var uncacheSession = function() {
		SessionService.unset('authenticated');
	};

	var showFlash = function(response) {
		FlashService.show(response);
	};

	return {
		register: function(details) {

			var register = $http.post('/account/create', angular.extend(details, TOKEN));
			register.success(function(data) { return data; });
			register.error(showFlash);

			return register;
		},
		signin: function(credentials) {

			credentials.remember = (credentials.remember) ? true : false;

			var signin = $http.post('/account/sign-in', angular.extend(credentials, TOKEN));
			signin.success(cacheSession);
			signin.error(showFlash);
			
			return signin;
		},
		signout: function() {

			var signout = $http.get('/account/sign-out');
			signout.success(uncacheSession);
			signout.success(showFlash);

			return signout;
		},
		isSignedIn: function() {

			return SessionService.get('authenticated');
		}
	};
}]);


//--- LinkedIn ---//

app.factory('linkedInService', ['localStorageService', function(localStorageService) {
	var l = localStorageService.get('linkedin');

	// formatted fields
	var f = {
		edu: '',
		exp: '',
		skills: []
	};

	if (l) {
		// education field
		angular.forEach(l.educations.values, function(i) {
			f.edu += i.schoolName + ' (' + 
					 i.startDate.year + '-' + i.endDate.year + ') \n' +
					 (i.degree ? i.degree + '\n' : '') +
					 (i.fieldOfStudy ? i.fieldOfStudy : '') + '\n';
		});

		// experience field
		angular.forEach(l.positions.values, function(i) {
			f.exp += '\n' + 
					  i.company.name + ' (' +
					  i.startDate.year + '-' + i.endDate.year + ') — ' +
					  i.title + '\n\n' + 
					  (i.summary ? i.summary + '\n\n' : '');
		});
		
		// skills field
		angular.forEach(l.skills.values, function(i) {
			this.push(i.skill.name);
		}, f.skills);

		return {
			name: 		l.formattedName,
			address: 	'',
			phone: 		'',
			email: 		l.emailAddress,
			website: 	'',
			about: 		l.summary,
			education: 	f.edu,
			experience: f.exp,
			skills: 	f.skills,
			interests: 	l.industry
		};
	}
}]);
