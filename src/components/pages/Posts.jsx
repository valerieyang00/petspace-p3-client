import { useState, useEffect } from "react"
import axios from "axios"
import { dblClick } from "@testing-library/user-event/dist/click"
import Moment from 'react-moment';

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
},[])

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
        <div key={`key-${idx}`}>
            {/* <img src={post.photo} alt={post._id}/> */}
            <p>{post.content}</p>
            <Moment fromNow>{post.createdAt}</Moment>
            {/* need to map an array of comments and hide it on Posts route */}
            {/* <p>{post.comment}</p> */}
            {/* changed this to '.length' to show number of likes */}
            <p>{post.likes.length} likes</p>
            
            {/* <p>{findUserById(post.user)}</p> */}
            
        </div>
    )

})
    return(
        <div>
        
            <h1>Posts</h1>
            {renderPosts}
            {imageIds && imageIds.map((imageId, idx) => (
                <Image
                    key = {idx}
                    cloudName ="sdfie0"
                    publicId = {imageId}
                    width = '300'
                    crop = 'scale'
                />
            ))}
        </div>
    )
}