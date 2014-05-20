<?php
class AccountController extends BaseController {
	
	//--- Sign In ---//

	public function postSignIn() {
		$input = array(
			'email'    => Input::get('email'),
			'password' => Input::get('password')
		);

		$validator = Validator::make($input, array(
			'email'    => 'required|email',
			'password' => 'required'
		));

		if ($validator->fails()) {

			return Response::json($validator->messages()->toArray(), 500);

		} else {

			$auth = Auth::attempt(array(
				'email'    => Input::json('email'),
				'password' => Input::json('password'),
				'active'   => 1
			), Input::json('remember'));

			if ($auth) {

				return Response::json(Auth::user());

			} else {

				return Response::json(array('error' => 'Incorrect credentials. Please try again.'), 500);
			}
		}

		return Response::json(array('error' => 'An unexpected error occurred. Please try again.'), 500);
	}


	//--- Sign Out ---//

	public function getSignOut() {
		Auth::logout();
		return Response::json(array('flash' => 'Signed out!'));
	}


	//--- Get User ---//


	public function getUser() {
		return Response::json(Auth::user());
	}


	//--- Create an Account ---//

	public function getCreate() {
		return View::make('create');
	}

	public function postCreate() {
		$validator = Validator::make(Input::all(), array(
			'email'	 		 => 'required|max:100|email|unique:users',
			'username' 		 => 'required|max:20|min:3|unique:users',
			'password' 		 => 'required|min:6',
			'password_again' => 'required|same:password'
		));

		if ($validator->fails()) {
			return Redirect::route('account-create')
				->withErrors($validator)
				->withInput();
		} else {
			// create the account

			$email    = Input::get('email');
			$username = Input::get('username');
			$password = Input::get('password');

			// Activation code

			$code = str_random(60);

			$user = User::create(array(
				'email'    => $email,
				'username' => $username,
				'password' => Hash::make($password),
				'code'     => $code,
				'active'   => 0
			));

			if ($user) {

				// Send email

				// Mail::send('emails.auth.test', array('name' => 'Alex'), function($message) {
				// 	$message->to('bronekszulc@gmail.com', 'Bronek')->subject('Test');
				// });

				Mail::send('emails.auth.activate', array(
					'link'     => URL::route('account-activate', $code),
					'username' => $username
				), function($message) use ($user) {
					$message->to($user->email, $user->username)->subject('Activate your account');
				});

				return Redirect::route('home')
					->with('global', 'Your account has been created! We have sent you an email to active your account.');
			}
		}
	}

	public function getActivate($code) {
		$user = User::where('code', '=', $code)->where('active', '=', 0);

		if ($user->count()) {
			$user = $user->first();

			// Update user to active state

			$user->active = 1;
			$user->code = '';
			
			if ($user->save()) {
				return Redirect::route('home')
					->with('global', 'Activated! You can now sign in!');
			}
		}

		return Redirect::route('home')
			->with('global', 'Your account is already active or there was a problem during activation.');
	}
}