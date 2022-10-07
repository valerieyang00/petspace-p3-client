import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Search() {
    const [form, setForm] = useState({
        username: ''
    })

    const [results, setResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async e => {
        try { 
            e.preventDefault() 
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/search`, form)
            // console.log(response.data)
            setResults(response.data)
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
     }


    const userLinks = results.map(user => {
        return (
            <div key={user._id}>
                <Link to={`/${user.username}`}>{user.username}</Link>
            </div>
        )
    })

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                        <input 
                            type='text'
                            id='username'
                            value={form.username}
                            placeholder='search username...'
                            onChange={e => setForm({ ...form, username: e.target.value })}
                        />
                        <button type='submit'>Search</button>
                </form>
            </div>

            <div>
                <h1>Results:</h1>

                {userLinks}

                <p>{errorMessage}</p>
            </div>

           
        </div>
    )
}