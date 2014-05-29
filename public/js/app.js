//-----------//
//--- App ---//
//-----------//


var app = angular.module('jobReady', ['ngRoute', 'ngSanitize']);

app.config(function($httpProvider) {
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
});

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		controller:  'HomeCtrl',
		title: 		 'Home',
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

	$routeProvider.when('/app/resume-builder', {
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


app.run(['$location', '$rootScope', 'AccountService', 'FlashService', function($location, $rootScope, AccountService, FlashService) {
	
	$rootScope.signedIn = AccountService.isSignedIn();

	console.log(AccountService.isSignedIn());

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

	// Set page title dynamically
	$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {

		$rootScope.signedIn = AccountService.isSignedIn();

		if (current && $rootScope.flash)
			if (current.originalPath !== $rootScope.flash.path)
				FlashService.clear();
		
		if (current.hasOwnProperty('$$route')) 
			$rootScope.title = current.$$route.title;

	});
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
                    if(current && current.$$route && current.$$route.css){
                        if(!Array.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!Array.isArray(next.$$route.css)){
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
app.directive('resume', function ($compile) {
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
});
