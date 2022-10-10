import {useState,useEffect} from 'react'
import { useParams, Link} from 'react-router-dom'
import axios from 'axios'
import Moment from 'react-moment';


export default function Profile({ currentUser, handleLogout }){
	const [posts, setPosts] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [user, setUser] = useState([])
	const [profile, setProfile] = useState(true)
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
				//check if currentUser is already following the profile they are viewing to display 'follow/unfollow' correctly when landing on '/:username'
				if(response.data.followers.includes(currentUser.id)) {
					setFollow(true)
				}
				//check to see if user is viewing their own profile and set Profile state accordingly
				if(currentUser.id === response.data._id) {
					setProfile(true)
				} else { setProfile(false)}

				setUser(response.data)
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
		//username is passed in the array to render the useEffect again each time user goes to different user's profile
	},[username])

	const handleDeletePost = async (postId) => {
		try {
			await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postId}`)
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
			setPosts(response.data.posts)

		}catch(err) {
			console.warn(err)
		}
	} 

	// Render Posts to a map
	const renderPostsAll = posts.map((post ,idx) => {
		return (
			<div key={`key-${idx}`}>
				{/* <img src={post.photo} alt={post._id}/> */}
				<p>{post.content}</p>
				<Moment fromNow>{post.createdAt}</Moment>
				{/* need to map an array of comments and hide it on Posts route */}
				{/* <p>{post.comment}</p> */}
				{/* changed this to '.length' to show number of likes */}
				<p>{post.likes.length} likes</p>

			</div>
		)
	})
	const renderPostsUser = posts.map((post ,idx) => {
		// console.log(posts)
		return (
			<div key={`key-${idx}`}>
				{/* <img src={post.photo} alt={post._id}/> */}
				<p>{post.content}</p>
				<Moment fromNow>{post.createdAt}</Moment>
				{/* need to map an array of comments and hide it on Posts route */}
				{/* <p>{post.comment}</p> */}
				{/* changed this to '.length' to show number of likes */}
				<p>{post.likes.length} likes</p>
				<Link to={`/posts/${post._id}/edit`}>
                <button>Edit</button>
            	</Link>
				<button onClick={(e) => handleDeletePost(post._id)}>Delete</button>

			</div>
		)
	})
	const handleFollowClick = async (e) => {
		try {			
			e.preventDefault()
			//sending currentUser and 'follow' state to backend to add follower/following if 'follow' is clicked, and remove follower/following if 'unfollow' is clicked on both currentUser and currentProfile users in the db
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, {currentUser: currentUser, status: follow})
			setFollowing(response.data.following)
			setFollowers(response.data.followers)
			//'follow' state switch between follow/unfollow on click event
			setFollow(!follow)

		}catch(err) {
			console.warn(err)
		}
	}

	 const viewUserProfile = (
		<>
			{/* if the user viewing their own profile... */}
			<h1>Welcome to your profile, {username}!</h1>
			<h4>{user.bio}</h4>
			<Link to={`/${username}/edit`}>
                <button>Edit Profile</button>
            	</Link>
			<p>{posts.length} Posts</p>
			<p>{followers.length} Followers</p>
			<p>{following.length} Following</p>
				<ul>Posts: {renderPostsUser}</ul>
			
		</>
	 )

	 const viewOtherProfile = (
		<>
			{/* if the user viewing someone else's profile... */}
			<h1>{username}'s profile</h1>
			{/* button to switch between follow/unfollow based on state changes */}
			<button onClick={handleFollowClick}>{follow ? "unfollow" : "Follow"}</button>
			<p>{posts.length} Posts</p>
			<p>{followers.length} Followers</p>
			<p>{following.length} Following</p>
				<ul>Posts: {renderPostsAll}</ul>
			
		</>
	 )




	return(
		<div>
			{/* conditionally render based on currentUser and profileUser */}
			{profile ? viewUserProfile : viewOtherProfile}			
		</div>
	)
}


