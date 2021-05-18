import React from 'react'
import Toggable from './Toggable'
import PropTypes from 'prop-types'

export default function LoginForm({username, password, handleUsernameChange, handlePasswordChange, handleSubmit}) {
	return (
		<Toggable buttonLabel="Show Login">
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type='text'
						value={username}
						name='Username'
						placeholder='Username'
						onChange={handleUsernameChange}
					/>
				</div>
				<div>
					<input
						type='password'
						value={password}
						name='Password'
						placeholder='Password'
						onChange={handlePasswordChange}
					/>
				</div>
				<button id="form-login-button">Login</button>
			</form>
		</Toggable>
	)
}

LoginForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	username: PropTypes.string,
	password: PropTypes.string
}
