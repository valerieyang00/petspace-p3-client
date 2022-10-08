import { useState, useEffect } from "react"
import axios from "axios"

export default function Posts(){
	
    const [posts, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [content, setContent] = useState("")


    useEffect(() => {
        const getPosts = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`)
                setPosts(response.data)
            }catch(err){
                setErrorMessage(err.message)

            }
        }
        getPosts()
},[])


const renderPosts = posts.map((post) => {
    return (
        <div key={post.id}>
            <img src={post.photo} alt={post._id}/>
            <p>{post.content}</p>
            <p>{post.user_Id}</p>
            {/* need to map an array of comments and hide it on Posts route */}
            {/* <p>{post.comment}</p> */}
            {/* changed this to '.length' to show number of likes */}
            <p>{post.likes.length} likes</p>
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