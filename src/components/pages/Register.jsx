import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Navigate } from 'react-router-dom'

export default function Register({ currentUser, setCurrentUser }) {
	// state for the controlled form
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')

	// submit event handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			// post fortm data to the backend
			const reqBody = {
				username,
				email, 
				password,
				}
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/register`, reqBody)

			// save the token in localstorage
			const { token } = response.data
			localStorage.setItem('jwt', token)

			// decode the token
			const decoded = jwt_decode(token)

			// set the user in App's state to be the decoded token
			setCurrentUser(decoded)

		} catch (err) {
			console.warn(err)
			if (err.response) {
				setMsg(err.response.data.msg)
			}
		}
 	}

	// conditionally render a navigate component
	if (currentUser) {
		return <Navigate to={`/${currentUser.username}`} />
	}

	return (
		<div>
			<div className='container'>
				<div className='row content justify-content-center align-content-center inner-row'>
					<div className='col-md-5'>
						<div className='form-box bg-white p-4 rounded'>
							<div className='form-title'>
								<h1 className='mb-4 text-center fs-1'>Register for an account:</h1>
								<p>{msg}</p>
							</div>

							<form className='mb-3' onSubmit={handleSubmit}>
								<div className='form-floating mb-3'>
									<label htmlFor='floatingInput'>Username</label>

									<input class="form-control form-control-sm rounded"
										type="text"
										id="floatingInput"
										placeholder='your username...'
										onChange={e => setUsername(e.target.value)}
										name='username'
										value={username}
									/>
								</div>

								<div className="form-floating mb-3">
									<input className='form-control form-control-sm' 
										type="email"
										id="email"
										placeholder='your email...'
										onChange={e => setEmail(e.target.value)}
										value={email}
									/>
									<label htmlFor='email'>Email:</label>
								</div>

								<div className="form-floating mb-3">
									<label htmlFor='password'>Password:</label>
									<input class="form-control form-control-sm"
										type="password"
										id="password"
										placeholder='password...'
										onChange={e => setPassword(e.target.value)}
										value={password}
									/>
								</div>
								
								<div className='d-grid gap-2 mb-3'>
									<button type="submit" className='btn btn-dark btn-lg border-0 rounded-4'>Register</button>
								</div>
								
							</form>
						</div>

					</div>
				</div>
			</div>
			

			

		</div>
	)
}