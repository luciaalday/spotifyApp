import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loginWithSpotify, exchangeCodeForToken } from '../spotify/auth';
import { getCurrentUser } from '../spotify/api';

export default function Navside({ isOpen }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            exchangeCodeForToken(code).then(async () => {
                window.history.replaceState({}, '', '/');
                const userData = await getCurrentUser();
                setUser(userData);
                setLoggedIn(true);
            });
        } else if (localStorage.getItem('access_token')) {
            getCurrentUser().then((userData) => {
                setUser(userData);
                setLoggedIn(true);
            });
        }
    }, []);

    const handleLogin = () => {
        loginWithSpotify();
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('code_verifier');
        setLoggedIn(false);
        setUser(null);
    };

    return (
        <nav className={`side-nav-container ${isOpen ? 'open' : ''}`}>
            {loggedIn ? (
                <div className='side-nav flex-col'>
                    {user?.images?.[0]?.url && (
                        <img
                            src={user.images[0].url}
                            alt="Profile"
                            style={{ width: 100, height: 100, borderRadius: '50%', margin: '40px auto 0' }}
                        />
                    )}
                    <h1>{user?.display_name || 'User'}</h1>
                    <div className='menu-options'>
                        <hr></hr>
                        <Link className='menu-item' to="/top-tracks">Top Tracks</Link>
                        <hr></hr>
                        <Link className='menu-item' to="/top-artists">Top Artists</Link>
                        <hr></hr>
                        <Link className='menu-item' to="/recently-played">Recently Played</Link>
                        <hr></hr>
                    </div>
                    <button className='login' onClick={handleLogout}>Sign out</button>
                </div>
            ) : (
                <div className='side-nav flex-col'>
                    <h1>View stats</h1>
                    <button className='login' onClick={handleLogin}>
                        Sign in with Spotify
                    </button>
                </div>
            )}
        </nav>
    );
}