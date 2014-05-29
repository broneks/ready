<?php
//----- Main -----//

Route::get('/', array(
	'as'   => 'home',
	'uses' => 'HomeController@getHome'
));


//----- Auth -----//

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

Route::get('/app/templates', array(
	'before' => 'auth',
	'as'     => 'templates',
	'uses'   => 'TemplateController@getTemplates'
));

// Unauthenticated group

Route::post('/account/create', array(
	'before' => 'csrf_json',
	'as'     => 'account-create-post',
	'uses'   => 'AccountController@postCreate'
));

Route::get('/account/active/{code}', array(
	'as'   => 'account-activate',
	'uses' => 'AccountController@getActivate'
));

Route::post('/account/sign-in', array(
	'before' => 'csrf_json',
	'as'     => 'account-sign-in-post',
	'uses'   => 'AccountController@postSignIn'
));
