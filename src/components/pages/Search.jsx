import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Search() {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const getUsers = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users`)
                setResults(response.data)
            }catch(err){
                setErrorMessage(err.message)

            }
        }
        getUsers()
    },[])
    
    // console.log(results)


    const handleSearch = (e) => {
        setSearch(e.target.value)
     }

    const filteredUsers = results.filter(result => {
        return result.email.toLowerCase().includes(search.toLowerCase())
    
    })
 


    const userLinks = filteredUsers.map(user => {
        return (
            <div key={user._id}>
                <Link to={`/${user.username}`}>{user.username}</Link>
            </div>
        )
    })

    return (
        <div>
            <div>
                <form>
                        <input 
                            type='text'
                            id='username'
                            value={search}
                            placeholder='search username...'
                            onChange={handleSearch}
                        />
                        {/* <button type='submit'>Search</button> */}
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