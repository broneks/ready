<?php
//----- Main -----//

Route::get('/', array(
	'as'   => 'home',
	'uses' => 'HomeController@getHome'
));


//----- Saved Docs -----//

Route::post('/doc/save', array(
	'before' => 'auth',
	'uses'   => 'DocController@postSaveDoc'
));

Route::get('/doc/list', array(
	'before' => 'auth',
	'uses'   => 'DocController@getDocList'
));

Route::post('/doc/get', array(
	'before' => 'auth',
	'uses'   => 'DocController@postGetDoc'
));

Route::post('/doc/delete', array(
	'before' => 'auth',
	'uses'   => 'DocController@postDeleteDoc'
));


//----- PDF Download-----//

Route::post('/pdf/make', array(
	'before' => 'auth',
	'uses'   => 'DocController@postPDF'
));

Route::get('/pdf/get', array(
	'before' => 'auth',
	'uses'   => 'DocController@getPDF'
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
