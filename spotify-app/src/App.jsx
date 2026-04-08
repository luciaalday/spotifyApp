import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Error from './navigation/Error';
import Nav from './navigation/Nav';
import Navside from './navigation/Navside';
import Footer from './navigation/Footer';

import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import TopArtists from './pages/TopArtists';

export default function App() {
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="App">
            <Router>
                <Nav isOpen={isOpen} setOpen={setOpen} />
                <div className="container">
                    <Navside isOpen={isOpen} />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/top-tracks" element={<TopTracks />} />
                        <Route path="/top-artists" element={<TopArtists />} />
                        <Route path="/callback" element={<Login />} />
                        <Route path="*" element={<Error code={404} />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </div>
    )
}