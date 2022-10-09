import {useState,useEffect} from 'react'
import { useParams} from 'react-router-dom'
import axios from 'axios'


export default function Profile({ currentUser, handleLogout }){
	const [posts, setPosts] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [content, setContent] = useState([])
	const [followers, setFollowers] = useState([])
	const [following, setFollowing] = useState([])
	const [follow, setFollow] = useState(false)

	const { username } = useParams()
	
	// Find a profile
	useEffect(() => {
		const getProfile = async () => {
			try{
				// get the token from local storage
				const token = localStorage.getItem('jwt')
				// make the auth headers
				const options = {
					headers: {
						'Authorization': token
					}
				}
				// hit the auth locked endpoint
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, options)
				setFollowing(response.data.following)
				setFollowers(response.data.followers)
				setPosts(response.data.posts)
				// setFriends(response.data.friends)
			}catch(err){
				console.warn(err)
				handleLogout()
			}
		}
		getProfile()
	},[follow])

	// Render Posts to a map
	const renderPosts = posts.map((post ,idx) => {
		return (
			<div key={`key-${idx}`}>
				{/* <img src={post.photo} alt={post._id}/> */}
				<p>{post.content}</p>
				<p>{`-${username}`}</p>
				{/* need to map an array of comments and hide it on Posts route */}
				{/* <p>{post.comment}</p> */}
				{/* changed this to '.length' to show number of likes */}
				<p>{post.likes.length} likes</p>

			</div>
		)
	})

	const handleFollowClick = async (e) => {
		try {			
			e.preventDefault()
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, currentUser)
			setFollow(!follow)

		}catch(err) {
			console.warn(err)
		}
	}


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
			<button onClick={handleFollowClick}>{follow ? "unfollow" : "Follow"}</button>
			<p>{posts.length} Posts</p>
			<p>{followers.length} Followers</p>
			<p>{following.length} Following</p>

				<ul>Posts: {renderPosts}</ul>
			
		</div>
	)
}


