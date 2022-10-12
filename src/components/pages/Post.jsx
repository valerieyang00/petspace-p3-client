
import { useEffect, useReducer, useState } from "react"
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
            <div key={`comment-${comment._id}`}>
                <div className="row p-0 d-flex border-bottom border-2">
                    <div className='col-md-9 d-flex p-0 align-items-start mt-1 ms-2'>
                       <p><span className='fw-bold d-flex'>{comment.user.username}: </span>
                         {comment.content}</p>
                    </div>
                    <div className='col-sm-2 d-flex align-items-center'>
                        {comment.user.username === currentUser.username ?<div className='d-flex justify-content-end align-items-center p-0'> 
                        <Link className='p-0 m-1 btnComment' to={`/posts/${postid}/comments/${comment._id}/edit`}>
                        <button className="btnComment p-0 shadow-none"><i class="bi bi-pencil-square"></i></button>
                        </Link> 
                        <button className='btnComment p-0 shadow-none' onClick={() => deleteComment(comment._id)}><i class="bi bi-trash3-fill"></i></button> 
                        </div>: <p></p>}
                        {/* <button onClick={handleCommentLikes}>Like</button> */}
                    </div>
                        <div className="d-flex justify-content-end">
                            <Moment fromNow>{comment.createdAt}</Moment>
                        </div>
                </div>
                {/* <p>@{comment.user.username} {comment.content}</p>
                <Moment fromNow>{comment.createdAt}</Moment>
                {comment.user.username === currentUser.username ? <div> <Link to={`/posts/${postid}/comments/${comment._id}/edit`}><button>Edit</button></Link> <button onClick={() => deleteComment(comment._id)}>Delete</button> </div>: <p></p>}
                <button onClick={handleCommentLikes}>Like</button> */}
            </div>
        )
    })

    return(
        <div>
            <h1 className="postTitlePage my-3">Post</h1>
            <div className='container d-flex justify-content-center'>
                <div className="card mb-3 border postCard">
                    <div className="row g-0">
                         {/* Holds image for card */}
                        <div className="col-md-6 align-items-center">
                            <img src={post.photo} alt={post.id} className='rounded-start mw-100 postImage' height="auto"/>
                        </div>
                        <div className="col-md-6">
                            {/* Header + Like and edit buttons */}
                            <div className='card-header d-flex justify-content-between postCardHeader'>
                                <div>
                                    <a href={`/${user.username}`} className='postCardTitle'>
                                        <h5 className="card-title d-flex justify-content-start mt-1 fw-bold">{user.username}</h5>
                                    </a>
                                </div>
                                <div>
                                    { curUser ? <Link to={`/posts/${post._id}/edit`}> <button className='btn mt-0 shadow-none editHeaderBtn'> Edit</button>
                                    </Link>: <p></p>}
                                </div>
                            </div>

                            <div className="row card-body d-flex justify-content-start commentsSection p-0 m-1">
                                <div className='row d-inline-flex justify-content-start mb-3 p-0 m-auto'>
                                    {/* <div className='col-5 mt-1 p-0 fw-bold'>
                                        <h1 className='postCardTitle'>@{user.username}</h1>
                                    </div> */}
                                    <div className='col-7 me-0 p-0'>
                                        <p className="card-text d-flex justify-content-start">{post.content}</p>
                                    </div>
                                </div>
                                <div className='cardComments'>
                                    {/* Render the list of comments */}
                                    {renderComments}
                                    {/* Error messages if they occur */}
                                    {/* {errorMessage}
                                    {commentErrorMessage} */}
                                </div>
                            </div>

                            <div className='card-body d-flex p-0 m-2 justify-content-between align-items-center cardPostBody'>
                                <div className='d-flex align-items-top'>
                                    <button onClick={handleLikes} type='button' className='mx-2 p-0 shadow-none likeBtnPost'>
                                    {like ? "❤️" : "🤍"}</button>
                                    
                                    <p className='mt-2'>{likes} likes</p>
                                </div>
                                <p className="card-text mt-2"><Moment fromNow>{post.createdAt}</Moment></p>
                            </div>

                            <div className='card-footer d-flex align-items-start mt-1 p-0'>
                                <div className="d-flex cardSubComment p-0">
                                    {currentUser?
                                        <form onSubmit={handleComment} className='m-2 p-0 d-flex justify-content-start'>
                                        <div className='row d-flex '>
                                            <div className='col'>
                                                <div className="d-flex ms-2 p-0">
                                                    <label htmlFor="comment">
                                                    <i class="bi bi-emoji-smile"></i> {currentUser.username}
                                                    </label>  
                                                </div>
                                                
                                        
                                                <input className='p-0 inputBarPost  shadow-none border m-1 align-items center' type="text" placeholder=' add comment...' value={comment} onChange={(e) => setComment(e.target.value)}/>
                                                <button type="submit" style = {{backgroundColor: '#d86e03', width: '100px' }} className=' shadow-none p-0' >Submit</button>

                                            </div>
                                           
                                        </div>
                                        
                                        </form> 
                                    : <p></p>} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}