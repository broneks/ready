<?php
class AccountController extends BaseController {
	
	//--- Sign In ---//

	public function postSignIn() {
		$path = '/account/sign-in';

		$input = array(
			'email'    => Input::get('email'),
			'password' => Input::get('password')
		);

		$validator = Validator::make($input, array(
			'email'    => 'required|email',
			'password' => 'required'
		));

		if ($validator->fails()) {

			return Response::json(array_merge($validator->messages()->toArray(), array('path' => $path)), 500);

		} else {

			$auth = Auth::attempt(array(
				'email'    => Input::json('email'),
				'password' => Input::json('password'),
				'active'   => 1
			), Input::json('remember'));

			if ($auth) {

				return Response::json(Auth::user());

			} else {

				return Response::json(array('error' => 'Incorrect credentials. Please try again.', 'path' => $path), 500);
			}
		}

		return Response::json(array('error' => 'An unexpected error occurred. Please try again.', 'path' => $path), 500);
	}


	//--- Sign Out ---//

	public function getSignOut() {
		Auth::logout();
		return Response::json(array('flash' => 'Signed out!', 'path' => '/'));
	}


	//--- Get User ---//

	public function getUser() {
		$user = Auth::user();

		// id, code

		return Response::json(array(
			'email'    => $user['email'],
			'username' => $user['username']
		));
	}


	//--- Create an Account ---//

	public function postCreate() {
		$path = '/account/create';

		$input = array(
			'email'          => Input::get('email'),
			'username'       => Input::get('username'),
			'password'       => Input::get('password'),
			'password_again' => Input::get('password_again')
		);

		$validator = Validator::make($input, array(
			'email'	 		 => 'required|max:100|email|unique:users',
			'username' 		 => 'required|max:20|min:3|unique:users',
			'password' 		 => 'required|min:6',
			'password_again' => 'required|same:password'
		));

		if ($validator->fails()) {

			return Response::json(array_merge($validator->messages()->toArray(), array('path' => $path)), 500);

		} else {
			// create the account

			$email    = Input::json('email');
			$username = Input::json('username');
			$password = Input::json('password');

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

				try {

					Mail::send('emails.auth.activate', array(
						'link'     => URL::route('account-activate', $code),
						'username' => $username
					), function($message) use ($user) {
						$message->to($user->email, $user->username)->subject('Activate your account');
					});

					return Response::json(array('flash' => 'Your account has been created! We have sent you an email to active your account.', 'path' => '/'));
			
				} catch(Exception $e) {

					$user->delete();

					return Response::json(array('error' => 'An unexpected error occurred. Please try again.', 'path' => $path), 500);

				}
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
				return Redirect::to('/');
			}
		}

		return Redirect::to('/');
	}
}