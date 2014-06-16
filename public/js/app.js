//-----------//
//--- App ---//
//-----------//


var app = angular.module('jobReady', ['ngRoute', 'LocalStorageModule']);

app.config(['$httpProvider', 'localStorageServiceProvider', function($httpProvider, localStorageServiceProvider) {
	var logsOutUserOn401 = function($location, $q, SessionService, FlashService) {
		var success = function(response) {
			return response;
		};
		var error = function(response) {
			if (response.status === 401) {
				SessionService.unset('authenticated');
				FlashService.show(response.data);
				$location.path('/');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		};

		return function(promise) {
			return promise.then(success, error);
		};
	};

	$httpProvider.responseInterceptors.push(logsOutUserOn401);

	localStorageServiceProvider.setPrefix('jobready');
}]);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		title: 		 'Resume Builder',
		requireAuth: false
	});

	$routeProvider.when('/account/create', {
		templateUrl: 'templates/register.html',
		controller:  'RegisterCtrl',
		title:       'Create an Account',
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

	$routeProvider.when('/app/dashboard', {
		templateUrl: 'templates/dashboard.html',
		controller:  'DashboardCtrl',
		title:       'Your Dashboard',
		requireAuth: true
	});

	$routeProvider.when('/app/resume-builder/:docId?', {
		templateUrl: 'templates/builder.html',
		controller:  'BuilderCtrl',
		title:       'Resume Builder',
		css: 		 [ '../css/fonts.css', '../css/templates.css' ],
		requireAuth: true
	});

	$routeProvider.when('/app/job-matcher', {
		templateUrl: 'templates/matcher.html',
		controller:  'MatcherCtrl',
		title:       'LinkedIn Job Matcher',
		requireAuth: true
	});

	$routeProvider.otherwise({ redirectTo: '/' });
});


app.run(['$location', '$rootScope', 'AccountService', 'FlashService', 'localStorageService', function($location, $rootScope, AccountService, FlashService, localStorageService) {

	$rootScope.signedIn = AccountService.isSignedIn();

	// Block unauthenticated users from pages that require auth
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (next.requireAuth && !AccountService.isSignedIn()) {

			event.preventDefault();
			$location.path('/');
			
		} else if (AccountService.isSignedIn() && next.originalPath === '/') {

			event.preventDefault();
			$location.path('/app/dashboard');

		}
		return false;
	});

	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

		$rootScope.signedIn = AccountService.isSignedIn();

		// clear old flash messages on route change
		if (current && $rootScope.flash) {
			if (current.originalPath !== $rootScope.flash.path) {
				FlashService.clear();
			}
		}
		
		// Set page title dynamically
		if (current.hasOwnProperty('$$route')) {
			$rootScope.title = current.$$route.title;
		}
	});

	// get linkedin profile data
	$rootScope.getLinkedInData = function() {
		if (!localStorageService.get('linkedin')) {
			IN.API.Profile('me')
				.fields(['formatted-name','industry','headline','location','email-address','phone-numbers','summary','educations','positions','skills','interests'])
      			.result(function(result) {
      				localStorageService.set('linkedin', result.values[0]);
      			});
		}
	};
}]);


// load stylesheets dynamically by route
app.directive('head', ['$rootScope','$compile', function($rootScope, $compile){
        return {
            restrict: 'E',

            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};

                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if (current && current.$$route && current.$$route.css){
                        if (!Array.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if (next && next.$$route && next.$$route.css){
                        if (!Array.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
	}
]);


// insert selected resume template into the DOM
app.directive('resume', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
        	'doc': '=',
        	'template': '='
        },
        link: function(scope, elt) {
            scope.$watch('template', function(newValue, oldValue) {
                if (newValue) {
                	var element = angular.element(scope.template);
                	var compiled = $compile(element)(scope);

                	elt.empty();
                	elt.append(compiled);
                }
            });
        }
    };
}]);


// convert MySQL datetime string to Angular datetime string
app.filter('asDate', function() {
  return function(original) {
    var converted = original.replace(/(.+) (.+)/, '$1T$2Z');

    return converted;
  };
});
