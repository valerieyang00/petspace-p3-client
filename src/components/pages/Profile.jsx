import { useState, useEffect } from 'react'
import axios from 'axios'


export default function Profile({ currentUser, handleLogout }) {
	// state for the secret message (aka user privilaged data)
	const [msg, setMsg] = useState('')
	const [bio, setBio] = useState('')

	// useEffect for getting the user data and checking auth
	useEffect(() => {
	const fetchData = async () => {
			try {
				// get the token
				const token = localStorage.getItem('jwt')
				// make the auth headers 
				const options = {
					headers: {
						'Authorization': token
					}
				}
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/auth-locked`, options)
				// await axios.post(url, requestBody (form data), options)
				setMsg(response.data.msg)
			} catch (err) {
				// Auth Failed
				console.warn(err)
				if (err.response) {
					if (err.response.status === 401) {
						handleLogout()
					}
				}
			}
		}
		fetchData()
	},[])
	const handleBioSubmit = async e => {
		e.preventDefault()
		try {
			// get the token from local storage
			const token = localStorage.getItem('jwt')
			// make the auth headers
			const options = {
				headers: {
					'Authorization': token
				}
			}

			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/profile`, {bio: bio}, options)
			setMsg(response.data.msg)
		} catch (err) {
			//Auth failed
			console.warn(err)
			if (err.response) {
				if (err.response.status === 401) {
					handleLogout()
				}
			}
	return (
		<div>
			<h1>Hello, {currentUser.name}</h1>

			<p>your email is {currentUser.email}</p>

			<h2>Here is the secret message that is only availible to users of User App:</h2>

			<h3>{msg}</h3>
			<form onSubmit={handleBioSubmit}>
				<label htmlFor='bio'>Bio:</label>
				<input
					type="text"
					name="bio"
					value={bio}
					onChange={e => setBio(e.target.value)}
				/>
				<button type="submit">Submit</button>
			</form>

		</div>
	)
}}}