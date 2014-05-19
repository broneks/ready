<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>jobReady | @yield('title')</title>
</head>
<body>
	<div id="wrap">
		@if(Session::has('global'))
			<p>{{ Session::get('global') }}</p>
		@endif

		@include('layouts.navigation')
		@yield('main')
	</div>
</body>
</html>