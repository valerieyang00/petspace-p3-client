import { useState, useEffect } from "react"
import axios from "axios"
import { dblClick } from "@testing-library/user-event/dist/click"
import Moment from 'react-moment';
import { Link } from 'react-router-dom'

import {Image} from 'cloudinary-react'
export default function Posts({ currentUser, setCurrentUser }){
	
    const [posts, setPosts] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [content, setContent] = useState("")

    const [imageIds, setImagesIds] = useState()

   
    useEffect(() => {
        const getPosts = async () => {
            try{
                const options = {
                    headers: {
                        'userid': currentUser.id
                    }
                }
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, options)
                setPosts(response.data)
            }catch(err){
                setErrorMessage(err.message)

            }
        }
        getPosts()
},[currentUser])

useEffect(() => {
    loadImages()
}, [])

const loadImages = async() => {
    try{
        const res =await fetch(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/api/images`)
        const data = await res.json()
        setImagesIds(data)
        console.log('IMG ID - > ', data)
    }catch(err){
        console.log(err)
    }
}

// const findUserById = (id) => {
//     const user = db.users.find({'_id': id})
//     return user.username
// }


const renderPosts = posts.map((post, idx) => {
    return (
       <div className="container ">
        <div className="row justify-content-center">
            <div className="col-sm-8 ">
                    <div className="card my-2" key={`key-${idx}`}>
                        <div className="card-header">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className="d-flex align-items-center">
                                    {/* profile pic */}
                                    <h6 class='mb-0 ms-2'>{post.user.username}</h6>
                                </div>
                                <div>
                                    <i class="bi bi-three-dots"></i>
                                </div>
                            </div>
                        </div>
                            
                        <div className="card-body p-0">
                            <div>
                                <img src={post.photo} alt={post._id} className='mw-100' height="auto"/>
                            </div>
                        </div>
                            

                        <div className="card-footer ">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div>
                                    <i class="fa-regular fa-heart fs-3 me-2"></i>
                                    <i class="fa-regular fa-comment fs-3"></i>
                                </div>
                                <div>
                                    <p>{post.likes.length} likes</p>
                                </div>
                            </div>
                                <div className='d-flex justify-content-start align-items-center'>
                                    <h4 className='fw-bold me-2 postTitleNCont'>{post.user.username}</h4>
                                    <h4 className='postTitleNCont'>{post.content}</h4>
                                </div>

                                <div className='d-flex'>
                                    <p><Link to={`/posts/${post._id}`} className='commentsLink'>View all {post.comments.length} coments</Link> </p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-sm-4"></div> */}
        </div>

        //     <Moment fromNow>{post.createdAt}</Moment>
        //     {/* need to map an array of comments and hide it on Posts route */}
        //     {/* <p>{post.comment}</p> */}
        //     {/* changed this to '.length' to show number of likes */}
            
            
        //     {/* <p>{findUserById(post.user)}</p> */}
            
        // </div>
    )

})
    return(
        <div>
        
            <h1>Posts</h1>
            {renderPosts}
            {/* {imageIds && imageIds.map((imageId, idx) => (
                <Image
                    key = {idx}
                    cloudName ="sdfie0"
                    publicId = {imageId}
                    width = '300'
                    crop = 'scale'
                />
            ))} */}
        </div>
    )
}