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
    
    console.log(results)


    const handleSearch = (e) => {
        setSearch(e.target.value)
     }

    const filteredUsers = results.filter(result => {
        return result.username.toLowerCase().includes(search.toLowerCase())
    
    })
 
    const handleClear = () => {
        setSearch('')
    }


    const userLinks = filteredUsers.map(user => {
        return (
            // <div key={user._id}>
            //     <Link to={`/${user.username}`}>{user.username}</Link>
            // </div>

            <div className="card" style={{width: "14rem", display:'flex',float: "inline-start", height: "auto", alignContent: "center"}} key={user._id}>
                 <img src={user.image} className="card-img-top" style={{width: "15rem", height: "15rem"}} />
            <div className="card-body">
                    <Link className="card-title" to={`/${user.username}`}>{user.username}</Link>
                <p className="card-text">{`Posts: ${user.posts.length} Follwers: ${user.followers.length} Following: ${user.following.length}`}</p>
                
            </div>
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
                        <button onClick={handleClear} style = {{backgroundColor: '#FC6767', width: '150px' }}>Clear</button>
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