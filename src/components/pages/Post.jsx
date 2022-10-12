
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Moment from 'react-moment';
import axios from 'axios'

export default function Post({ currentUser, setCurrentUser }){

    
    const {postid} = useParams()
    const [post, setPost] = useState({user: {_id: ''}})
    const [errorMessage, setErrorMessage] = useState("")
    const [comment, setComment] = useState("")
    const [likes, setLikes] = useState(0)
    const [like, setLike] = useState(false)
    const [user, setUser] = useState({})
    const [curUser, setCurUser] = useState(false)
    const [comments, setComments] = useState([])
    const [commentLikes, setCommentLikes] = useState(0)
    const [commentErrorMessage, setCommentErrorMessage] = useState("")


    //Renders the post and comments
    useEffect(() => {
        const getPost = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}`)
                setPost(response.data)
                setUser(response.data.user)
                setComments(response.data.comments)
                setLikes(response.data.likes.length)
                if (currentUser.id === response.data.user._id) {
                    setCurUser(true)
                }
                
                console.log(response.data)
                console.log(currentUser)
                response.data.likes.forEach((like) => {
                    if (like.user === currentUser.id) {
                        setLike(true)
                    }
                })

            }catch(err){
                setErrorMessage(err.message)
            }
        }
        getPost()
    },[currentUser])

    const handleDelete = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}`)
            setPost(response.data)
        }catch(err){
            setErrorMessage(err.message)
        }
    }

    // Renders the comments
    const handleComment = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/comments`, {content: comment, userId : currentUser.id})
            setComments([...comments, response.data])
            setComment("")
        }catch(err){
            setCommentErrorMessage(err.message)
        }
    }
    const deleteComment = async (commentid) => {
        try{
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/comments/${commentid}`)
            setComments(response.data.comments)
        }catch(err){
            setCommentErrorMessage(err.message)
        }
    }
    // // Allows users to link a comment to a post
    // const handleCommentLikes = async (e) => {
    //     e.preventDefault()
    //     try{
    //         const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${commentId}/comments/${commentId}/likes`)
    //         setCommentLikes(response.data)
    //     }catch(err){
    //         setCommentErrorMessage(err.message)
    //     }

    // }
    // Allows users to like a post
    const handleLikes = async (e) => {
        e.preventDefault()
        try{
            if (like) {
                const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/like`, {userId: currentUser.id})
                console.log(currentUser.id)
                setLike(false)
                setLikes(response.data.likes.length)
            } else {
                // need to check this route again after setting up on backend to account for likes on both Post model and User model
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/like`, {userId: currentUser.id})
                setLike(true)
                setLikes(response.data.likes.length)
            }
            
        }catch(err){
            setErrorMessage(err.message)
        }
    }
    // // Allows users to edit their post
    // const handleEdit = async (e) => {
    //     e.preventDefault()
    //     try{
    //         if(post.user.id === user.id){
    //             const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/editpost/${postid}`, {post})
    //             setPost(response.data)
                
    //         }
    //     }catch(err){
    //             setErrorMessage(err.message)
    //         }
    //     }

    // renders comments to the post with likes

    const renderComments = comments.map((comment) => {
        return (
            <div key={comment._id}>
                <p>@{comment.user.username} {comment.content}</p>
                <Moment fromNow>{comment.createdAt}</Moment>
                {comment.user.username === currentUser.username ? <div> <Link to={`/posts/${postid}/comments/${comment._id}/edit`}><button>Edit</button></Link> <button onClick={() => deleteComment(comment._id)}>Delete</button> </div>: <p></p>}
                {/* <button onClick={handleCommentLikes}>Like</button> */}
            </div>
        )
    })

    return(
        <div>
            <h1>Post</h1>
            <a href={`/${user.username}`}>{user.username}</a>
            <p><img src={post.photo} alt={post.id} width="500" height="auto"/></p>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <Moment fromNow>{post.createdAt}</Moment>
            <p>{likes} likes</p>
            <button onClick={handleLikes} style = {{backgroundColor: '#FC6767', width: '100px' }} >{like? "Unlike" : "Like"}</button>
            { curUser ? <Link to={`/posts/${post._id}/edit`}> <button style = {{backgroundColor: '#FC6767', width: '100px' }}> Edit</button>
            	</Link>: <p></p>}
            
            
            {/* Comment form to create a new comment */}
            <h1>Comments</h1>
            {currentUser?
            {currentUser?
            <form onSubmit={handleComment}>
            <label htmlFor="comment">@{currentUser.username}</label>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}/>
            <button type="submit" style = {{backgroundColor: '#FC6767', width: '150px' }}>Submit</button>
            </form> 
            : <p></p>}
            
            {/* Render the list of comments */}
            {renderComments}
            {/* Error messages if they occur */}
            {/* {errorMessage}
            {commentErrorMessage} */}


        // </div>
    )
}