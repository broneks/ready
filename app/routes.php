<?php

//----- Main -----//

Route::get('/', array(
	'as'   => 'home',
	'uses' => 'HomeController@getHome'
));


//----- Login, Logout & Create Account -----//

// Authenticated group

Route::get('/account/sign-out', array(
	'before' => 'auth',
	'as'     => 'account-sign-out',
	'uses'   => 'AccountController@getSignOut'
));

Route::get('/account/user', array(
	'before' => 'auth',
	'as'     => 'account-user',
	'uses'   => 'AccountController@getUser'
));

// Unauthenticated group

Route::post('/account/sign-in', array(
	'before' => 'guest',
	'as'     => 'account-sign-in-post',
	'uses'   => 'AccountController@postSignIn'
));


Route::group(array('before' => 'guest'), function() {

	// CSRF protection group

	Route::group(array('before' => 'csrf'), function() {
		
		// create an account (POST)

		Route::post('/account/create', array(
			'as'   => 'account-create-post',
			'uses' => 'AccountController@postCreate'
		));
	});

	// create account (GET)

	Route::get('/account/create', array(
		'as'   => 'account-create',
		'uses' => 'AccountController@getCreate'
	));

	Route::get('/account/active/{code}', array(
		'as'   => 'account-activate',
		'uses' => 'AccountController@getActivate'
	));
});
