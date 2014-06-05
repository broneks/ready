<!doctype html>
<html lang="en" ng-app="jobReady">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="Bronek Szulc">

	<title ng-bind="'jobReady | ' + title">jobReady</title>

	<link rel="icon" type="image/x-icon" href="/img/favicon.ico">
	<link rel="stylesheet" href="/css/normalize.min.css">
	<link rel="stylesheet" href="/css/main.css">
</head>
<body>

	<header id="top-header">
		<h1>jobReady</h1>

		<nav ng-cloak>
			<ul ng-if="!signedIn">
				<li>
					<a href="#/">Home</a>
				</li>
				<li>
					<a href="#/account/sign-in">Sign In</a>
				</li>
				<li>
					<a href="#/account/create">Create Account</a>
				</li>
			</ul>
			
			<ul ng-if="signedIn">
				<li>
					<a href="#/app/dashboard">Dashboard</a>
				</li>
				<li>
					<a href="#/account/sign-out">Sign Out</a>
				</li>
			</ul>
		</nav>
	</header>

	<ul id="flash" ng-if="flash" ng-repeat="(key, f) in flash" ng-cloak>
		<li ng-if="key !== 'path' && f[0].length == 1">{{ f }}</li>
		<li ng-if="key !== 'path' && f[0].length > 1">{{ f[0] }}</li>
	</ul>

	<div id="main" ng-view></div>

	<script src="/js/vendors/jquery-1.11.0.min.js"></script>
	<script src="/js/vendors/angular.min.js"></script>
	<script src="/js/vendors/angular-route.min.js"></script>
	<script src="/js/vendors/angular-local-storage.min.js"></script>
	<script src="/js/app.js"></script>
	<script>angular.module('jobReady').constant('TOKEN', {'csrf_token': '<?= csrf_token() ?>'});</script>
	<script src="/js/services.js"></script>
	<script src="/js/controllers.js"></script>
</body>
</html>