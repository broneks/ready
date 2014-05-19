<?php
class AccountController extends BaseController {
	
	//--- Sign In ---//

	public function getSignIn() {
		return View::make('signin');
	}

	public function postSignIn() {
		$validator = Validator::make(Input::all(), array(
			'email'    => 'required|email',
			'password' => 'required'
		));

		if ($validator->fails()) {
			// Redirect to sign in page

			return Redirect::route('account-sign-in')
				->withErrors($validator)
				->withInput();

		} else {

			$remember = (Input::has('remember')) ? true : false;

			$auth = Auth::attempt(array(
				'email'    => Input::get('email'),
				'password' => Input::get('password'),
				'active'   => 1
			), $remember);

			if ($auth) {
				// Redirect to the intended page

				return Redirect::intended('/');

			} else {
				return Redirect::route('account-sign-in')
					->with('global', 'Email or password was incorrent or the account has not been activted');
			}
		}

		return Redirect::route('account-sign-in')
			->with('global', 'There was a problem signing you in.');
	}


	//--- Sign Out ---//

	public function getSignOut() {
		Auth::logout();
		return Redirect::route('home');
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