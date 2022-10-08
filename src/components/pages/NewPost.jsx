import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function NewPost({ currentUser, setCurrentUser }){
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleCreate = async (e) => {
		e.preventDefault()
		try{
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, {content, userId : currentUser.id})
			setPosts([...posts, response.data])
			setContent("")
            navigate('/posts')
		}catch(err){
			setErrorMessage(err.message)
		}
	}
    console.log("NEW POST",currentUser)
    return(
        <div>
            <h1>New Post</h1>
            <form>   
                <label htmlFor="content">Content</label>
                <input type="text" name="content" id="content" value={content} onChange={(e) => setContent(e.target.value)}/>
        
                {/* <input hidden type="text" name="user" id="user"/> */}
                    {/* for when we add image upload functionality */}
                {/* <label htmlFor="image_url">Image URL</label> */}
                {/* <input type="file" name="image_url" id="image_url"/> */}
                <button type="submit" onClick={handleCreate}>Submit</button>
            </form>
        </div>
    )
}