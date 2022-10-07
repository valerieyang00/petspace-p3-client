import { useState, useEffect } from "react"
import axios from "axios"

export default function Posts(){
	
    const [posts, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [content, setContent] = useState("")


    useEffect(() => {
        const getPosts = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`)
                setPosts(response.data)
            }catch(err){
                setErrorMessage(err.message)

            }
        }
        getPosts()
},[])

	const handleCreate = async (e) => {
		e.preventDefault()
		try{
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, {content})
			setPosts([...posts, response.data])
			setContent("")
		}catch(err){
			setErrorMessage(err.message)
		}
	}
const renderPosts = posts.map((post) => {
    return (
        <div key={post.id}>
            <img src={post.image_url} alt={post.title}/>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>{post.user_Id}</p>
            <p>{post.comment}</p>
            <p>{post.likes}</p>
        </div>
    )

})
    return(
        <div>
            <h1>Posts</h1>
            {renderPosts}
        </div>
    )
}