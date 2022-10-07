import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditComment() {
    const [form, setForm] = useState({
        content: ''
    })
    const [errorMessage, setErrorMessage] = useState('')

    const {postId, commentId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getComment = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}/comments/${commentId}`)
                setForm(response.data)
            } catch(err) {
                console.warn(err)
                if (err.response) {
                    setErrorMessage(err.response.data.message)
                }
            }
        }
        getComment()
    }, [])

    const handleSubmit = async e => {
        try{
            e.preventDefault()
            // axios.put/.post('url', data for the req body)
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}/comments/${commentId}`, form)
            // navigate back to the details page for this bounty
            setForm(response.data)
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    return(
        <div>
            <h1>Edit Bounty:</h1>
            <p>{errorMessage}</p>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='content'>Wanted for:</label>
                    <input 
                        type='text'
                        id='content'
                        value={form.content}
                        placeholder='comment...'
                        onChange={e => setForm({ ...form, content: e.target.value })}
                    />
                </div>

                <button type='submit'>Submit</button>
            </form>
            
            <Link to={`/posts/${postId}`}>
                <button>Cancel</button>
            </Link>
        </div>
    )
}