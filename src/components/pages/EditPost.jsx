import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditPost() {
    const [form, setForm] = useState({
        title: '',
        caption: '',
        image: ''
    })
    const [errorMessage, setErrorMessage] = useState('')

    const {postId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}`)
                setForm(response.data)
            } catch(err) {
                console.warn(err)
                if (err.response) {
                    setErrorMessage(err.response.data.message)
                }
            }
        }
        getPost()
    }, [])

    const handleSubmit = async e => {
        try{
            e.preventDefault()
            // axios.put/.post('url', data for the req body)
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/posts/${postId}`, form)
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
            <h1>Edit Post:</h1>
            <p>{errorMessage}</p>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>title:</label>
                    <input 
                        type='text'
                        id='title'
                        value={form.title}
                        placeholder='title...'
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='caption'>caption:</label>
                    <input 
                        type='text'
                        id='caption'
                        value={form.caption}
                        placeholder='caption...'
                        onChange={e => setForm({ ...form, caption: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='image'>image:</label>
                    <input 
                        type='text'
                        id='image'
                        value={form.image}
                        placeholder='image...'
                        onChange={e => setForm({ ...form, image: e.target.value })}
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