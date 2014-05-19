@extends('layouts.base')

@section('title')
	create an account
@stop

@section('main')

	@if ($errors->any())
		<ul>
		@foreach($errors->all() as $e)
			<li>{{ $e }}</li>
		@endforeach
		</ul> 
	@endif

	
	<form action="{{ URL::route('account-create-post') }}" method="post">

		<div class="field">
			Email: 
			<input type="text" name="email">
		</div>

		<div class="field">
			Username: 
			<input type="text" name="username">
		</div>

		<div class="field">
			Password: 
			<input type="password" name="password">
		</div>

		<div class="field">
			Password Again: 
			<input type="password" name="password_again">
		</div>
		
		<input type="submit" value="Create an Account">

		{{ Form::token() }}

	</form>

@stop