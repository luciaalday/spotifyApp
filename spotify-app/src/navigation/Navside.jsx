import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loginWithSpotify, exchangeCodeForToken } from '../spotify/auth';
import { getCurrentUser } from '../spotify/api';
import CurrentTrack from '../components/CurrentTrack';

export default function Navside({ isOpen }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [authHandled, setAuthHandled] = useState(false);

    useEffect(() => {
        if (authHandled) return;

        const handleAuth = async () => {
            setAuthHandled(true);
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const existingToken = localStorage.getItem('access_token');

            try {
                // Exchange code for token (once)
                if (code && !existingToken) {
                    const data = await exchangeCodeForToken(code);
                    window.history.replaceState({}, '', '/');
                    console.log("Logged in successfully:", data.access_token);
                }

                // Fetch user & current track
                if (localStorage.getItem('access_token')) {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setLoggedIn(true);
                }
            } catch (err) {
                console.error("Auth flow error:", err);
            }
        };

        handleAuth();
    }, [authHandled]);

    const handleLogin = () => loginWithSpotify();

    const handleLogout = () => {
        localStorage.clear();
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
                        <hr />
                        <Link className='menu-item' to="/top-tracks">Top Tracks</Link>
                        <hr />
                        <Link className='menu-item' to="/top-artists">Top Artists</Link>
                        <hr />
                    </div>

                    <CurrentTrack />
                    <hr style={{ margin: '0 auto 20px', width: '60%' }} />
                    <button className='login' onClick={handleLogout}>Sign out</button>
                </div>
            ) : (
                <div className='side-nav flex-col'>
                    <h1>View stats</h1>
                    <button className='login' onClick={handleLogin}>Sign in with Spotify</button>
                </div>
            )}
        </nav>
    );
}