import {useState,useEffect} from 'react'
import axios from 'axios'


export default function Profile({ currentUser, setCurrentUser }){
	const [username, setUsername] = useState('')
	const [posts, setPosts] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [content, setContent] = useState('')
	const [friends, setFriends] = useState([])

	// Find a profile
	useEffect(() => {
		const getProfile = async () => {
			try{
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${currentUser.username}`)
				setUsername(response.data)
				setPosts(response.data.posts)
				setFriends(response.data.friends)
			}catch(err){
				console.warn(err)
			}
		}
		getProfile()
	},[])
	// Render Posts to a map
	const renderPosts = posts.map((post) => {
		return (
			<div key={post._id}>
				<img src={post.photo} alt={post._id}/>
				<p>{post.content}</p>
				<p>{post.user.username}</p>
				{/* need to map an array of comments and hide it on Posts route */}
				{/* <p>{post.comment}</p> */}
				{/* changed this to '.length' to show number of likes */}
				<p>{post.likes.length} likes</p>

			</div>
		)
	})
	// // Map Friends
	// const renderFriends = friends.map((friend) => {
	// 	return(
	// 		<div key = {friend._id}>
	// 			<p>{friend.username}</p>
	// 		</div>
	// 	)
	// })

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
			
				
				{/* <li>Friends: {renderFriends}</li> */}

				<li>Posts: {renderPosts}</li>
			
		</div>
	)
}


