import {useState,useEffect} from 'react'
import axios from 'axios'


export default function Profile(){
	const [username, setUsername] = useState('')
	const [posts, setPosts] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [content, setContent] = useState('')
	const [friends, setFriends] = useState([])
	useEffect(() => {
		const getProfile = async () => {
			try{
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`)
				setUsername(response.data)
				setPosts(response.data.posts)

			}catch(err){
				console.warn(err)
			}
		}
		getProfile()
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
	// useEffect(() => {
	// 	const findFriends = async () => {
	// 		try{
	// 			const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}/friends`)
	// 			setFriends(response.data.friends)
	// 		}catch(err){
	// 			console.warn(err)
	// 		}
	// 	}
	// 	findFriends()
	// },[])
	return(
		<div>
			
			<h1>Welcome to the profile of {username}</h1>
			<p>{username}</p>
			
				<li>Posts</li>
				<li>Friends</li>
				<li>Following</li>
				<li>{renderPosts}</li>
			
		</div>
	)
}


