<!doctype html>
<html lang="en" ng-app="jobReady">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="Bronek Szulc">

	<title ng-bind="'jobReady | ' + title">jobReady</title>

	<script src="/js/vendors/angular.min.js"></script>
	<script src="/js/vendors/angular-route.min.js"></script>
	<script src="/js/vendors/angular-sanitize.min.js"></script>
	<script>var app = angular.module('jobReady', ['ngRoute', 'ngSanitize']).constant('TOKEN', '<?= csrf_token() ?>');</script>
	<script src="/js/app.js"></script>
</head>
<body>
	<nav>
		<li><a href="#/">Home</a></li>
		<li><a href="#/dashboard">Dashboard</a></li>
		<li><a href="#/account/sign-in" ng-show="!signedin">Sign In</a></li>
	</nav>

	<ul id="flash" ng-show="flash" ng-repeat="error in flash" >
		<li>{{ error[0] }}</li>
	</ul>

	<div id="view" ng-view></div>
</body>
</html>