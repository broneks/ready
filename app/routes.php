<?php

//----- Main -----//

Route::get('/', array(
	'as'   => 'home',
	'uses' => 'HomeController@getHome'
));


//----- Login, Logout & Create Account -----//

// Authenticated group

Route::get('/account/sign-out', array(
	'as'   => 'account-sign-out',
	'uses' => 'AccountController@getSignOut'
))->before('auth');

// Unauthenticated group

Route::post('/account/sign-in', array(
	'as'   => 'account-sign-in-post',
	'uses' => 'AccountController@postSignIn'
))->before('guest', 'csrf');


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
