import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditProfile() {
    const {username} = useParams()
    const [form, setForm] = useState({
        username: username,
        bio: ''
        // profilePic: '' 
        // edit user password?
    })
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            try {
                // get the token from local storage
				const token = localStorage.getItem('jwt')
				// make the auth headers
				const options = {
					headers: {
						'Authorization': token
					}
				}
				// hit the auth locked endpoint
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, options)
                // console.log(response.data)
            } catch(err) {
                console.warn(err)
                if (err.response) {
                    setErrorMessage(err.response.data.message)
                }
            }
        }
        getUser()
    }, [])

    const handleSubmit = async e => {
        try{
            e.preventDefault()
            // axios.put/.post('url', data for the req body)
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}/edit`, form)
            // navigate back to the details page for this bounty
            setForm({username: response.data.username, bio: response.data.bio})
            navigate(`/${username}`)
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    return(
        <div>
            <h1>Edit Profile:</h1>
            <p>{errorMessage}</p>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input 
                        type='text'
                        id='username'
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='bio'>Bio:</label>
                    <input 
                        type='text'
                        id='bio'
                        value={form.bio}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                    />
                </div>

                <button type='submit'>Submit</button>
            </form>
            
            <Link to={`/${username}`}>
                <button>Cancel</button>
            </Link>
        </div>
    )
}