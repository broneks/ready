<?php

//----- Main -----//

Route::get('/', array(
	'as'   => 'home',
	'uses' => 'HomeController@getHome'
));


//----- Login, Logout & Create Account -----//

// Authenticated group

Route::group(array('before' => 'auth'), function() {

	Route::get('/account/sign-out', array(
		'as'   => 'account-sign-out',
		'uses' => 'AccountController@getSignOut'
	));

});

Route::post('/account/sign-in', array(
	'as'   => 'account-sign-in-post',
	'uses' => 'AccountController@postSignIn'
));

// Unauthenticated group

Route::group(array('before' => 'guest'), function() {

	// CSRF protection group

	Route::group(array('before' => 'csrf'), function() {
		
		// create an account (POST)

		Route::post('/account/create', array(
			'as'   => 'account-create-post',
			'uses' => 'AccountController@postCreate'
		));

		// Sign in (POST)

		
	});

	// Sign in (GET)

	// Route::get('/account/sign-in', array(
	// 	'as'   => 'account-sign-in',
	// 	'uses' => 'AccountController@getSignIn'
	// ));

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
