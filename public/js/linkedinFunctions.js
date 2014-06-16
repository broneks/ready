function onLinkedInLoad() {
	IN.Event.on(IN, 'auth', function() {
		angular.element(jQuery('#main')).scope().$apply(
			function($scope) {
				$scope.getLinkedInData();
			}
		);
	});
}

function linkedInLogout() {
	IN.User.logout();
}