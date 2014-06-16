//-------------------------//
//------ Controllers ------//
//-------------------------//



//--- Dashboard ---//

app.controller('DashboardCtrl', ['$scope', '$http', 'localStorageService', function($scope, $http, localStorageService) {

	// insert linkedin script if it is not there
	if (!localStorageService.get('linkedin') && !jQuery('script[src="http://platform.linkedin.com/in.js"]').length) {
		jQuery('<script>delete IN;</script><script type="text/javascript" src="http://platform.linkedin.com/in.js">api_key: 77noaiszyyly3g \n onLoad: onLinkedInLoad \n </script>').appendTo('body');
	}

	// get user
	$http.get('/account/user', { cache: true }).success(function(data) { 
		$scope.user = data.username; 
	});

	// get list of saved docs
	$http.get('/doc/list').success(function(data) {
		$scope.savedDocs = data;
		$scope.docsLoaded = true;
	});

	$scope.docDelete = function(obj) {
		var confirmDelete = confirm('Delete "' + obj.target.getAttribute('data-title') + '"?');
	
		if (confirmDelete) {
			var id = obj.target.getAttribute('data-id');

			$http.post('/doc/delete', { id: id }).success(function() {

				// remove deleted item from DOM (...this saves from having to do another ajax call to refresh the list)
				jQuery('a[data-id=' + id + ']').parent().remove();
			});
		}
	};
}]);


//--- Resume Builder ---//

app.controller('BuilderCtrl', ['$scope', '$http', '$routeParams', 'localStorageService', 'linkedInService', function($scope, $http, $routeParams, localStorageService, linkedInService) {

	// resume templates
	$http.get('/app/templates', { cache: true }).success(function(data) {
		$scope.templates = data;

		// if user is not opening a saved doc
		if (!$routeParams.docId) {
			$scope.temp = {
				id: 	  $scope.templates[0].id,
				template: $scope.templates[0].template
			};

			// stop the loading gif
			$scope.tempsLoaded = true;
		}
	});

	// change temp variable to reflect selected drop down item
	$scope.changeTemplate = function(id) {
		for (var i = 0; i < $scope.templates.length; i++) {
			var item = $scope.templates[i];

			if (item.id === id) {
				$scope.temp.template = item.template;
				break;
			}
		}
	};

	// user inputs
	
	// if the url contains a document id parameter
	if ($routeParams.docId) {

		$http.post('/doc/get', { id: $routeParams.docId })
		.success(function(data) {
			$scope.doc = JSON.parse(data.doc);

			$scope.temp = {
				id: 	  data.templateId,
				template: data.template
			};

			// stop the loading gif
			$scope.tempsLoaded = true;
		})
		.error(function() {
			$scope.temp = {
				id: 	  $scope.templates[0].id,
				template: $scope.templates[0].template
			};

			// stop the loading gif
			$scope.tempsLoaded = true;
		});

	// else if logged in with linkedin
	} else if (!$scope.doc && localStorageService.get('linkedin')) {

		// get formatted linkedin profile data from service
		$scope.doc = linkedInService;

	// else create an empty doc object
	} else {

		$scope.doc = {
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

	// save the draft document
	$scope.saveDoc = function() {
		var doc = {
			title: prompt('Save your doc as: ', 'doc title'),
			temp: $scope.temp.id,
			data: JSON.stringify($scope.doc)
		};

		if (doc.title) {
			$http.post('/doc/save', doc).success(function() {
				alert('Your doc was successfully saved!');
			});
		}
	};

	// output the resume as a PDF
	$scope.downloadPDF = function() {
		var html$ = jQuery('#resume').html();

		$http.post('/pdf/make', { html: html$ }).success(function() {
			window.location.href = 'http://' + window.location.host + '/pdf/get';
		});	
	};
}]);


//--- Job Matcher ---//

app.controller('MatcherCtrl', ['$scope', 'localStorageService', function($scope, localStorageService) {
	
	// ------------------------------------------------------------------ //
	// --- TO DO: Register for and implement LinkedIn Jobs Search API --- //
	// ------------------------------------------------------------------ //

	$scope.recommended = '""';

	var l = localStorageService.get('linkedin');

	if (l) {
		var skills = (l.skills._total > 0 ? l.skills.values : []);
		var random1 = '';
		var random2 = '';

		// if the user has more than one skill on their profile
		if (skills.length > 1) {
			random1 = Math.floor(Math.random() * skills.length);
			random2 = Math.floor(Math.random() * skills.length);

			while (random2 === random1) {
				random2 = Math.floor(Math.random() * skills.length);
			}
		}

		// user's location, LinkedIn profile headline and two random skill (if available)
		$scope.recommended = '"' + (l.location ? l.location.name + ' ' : '') +
							 (l.headline ? l.headline + ' ' : '') +
							 (random1 && random2 ? skills[random1].skill.name + ' ' +  skills[random2].skill.name : '') + '"';
 		
	}
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

			localStorageService.clearAll();

			$location.path('/');
		});
	}
}]);
