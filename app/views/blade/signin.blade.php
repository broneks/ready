@extends('layouts.base')

@section('title')
	Sign In
@stop

@section('main')

	@if ($errors->any()) 

		<ul>
		@foreach($errors->all() as $e)
			<li>{{ $e }}</li>
		@endforeach
		</ul>

	@endif
	
	<form action="{{ URL::route('account-sign-in-post') }}" method="post">

		<div class="field">
			Email:
			<input type="text" name="email">
		</div>

		<div class="field">
			Password:
			<input type="password" name="password">
		</div>

		<div class="field">
			<label for="remember">Remember Me</label>
			<input type="checkbox" name="remember" id="remember">
		</div>
		
		<input type="submit" value="Sign In">
		
		{{ Form::token() }}

	</form>

@stop