import { Link } from 'react-router-dom'

export default function Navbar({ currentUser, handleLogout }) {
	let username = ''

	if(currentUser){
		username = currentUser.username
	}
	 const loggedIn = (
		<>
			{/* if the user is logged in... */}
			<Link to="/">
				<span onClick={handleLogout}>Logout</span>
			</Link>{' | '}

			
			 <Link to={`/${username}`}>
				Profile
			</Link> {' | '}

			<Link to="/posts"> Posts </Link>{' | '}
			
			<Link to="/posts/new"> Create a Post </Link>{' | '}
			<Link to='/search'>Search</Link>
		</>
	 )
		

		
	 const loggedOut = (
		<ul>
			{/* if the user is not logged in... */}
			<Link to="/register">
				register
			</Link>{' | '}

			<Link to="/">
				login
			</Link>
		</>
	 )

	return (
		<nav className='navbar navbar-expand-lg navbar-dark'>
			<div className='container'>
				{/* image logo */}
				<div className='collapse navbar-collapse'>
					{/* user always sees this section */}

					<ul className='navbar-nav'>
					{currentUser ? loggedIn : loggedOut}

						<li class='nav-item'>
							<Link to="/">
								<p>Home</p>
							</Link>
						</li>
					</ul>
					
				</div>
			</div>

			

		</nav>
	)
}