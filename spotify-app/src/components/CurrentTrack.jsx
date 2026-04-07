import { useState, useEffect } from 'react';
import { getCurrentlyPlaying } from '../spotify/api';

export default function CurrentTrack() {
    const [currentTrack, setCurrentTrack] = useState(null);

    useEffect(() => {
        let intervalId;

        const fetchTrack = async () => {
            try {
                const data = await getCurrentlyPlaying();
                if (data && data.item) {
                    setCurrentTrack(data.item);
                } else {
                    setCurrentTrack(null);
                }
            } catch (err) {
                console.error("Error fetching current track:", err);
            }
        };
        fetchTrack();
        // Poll every 5 seconds
        intervalId = setInterval(fetchTrack, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (!currentTrack) return <p>No song playing</p>;

    return (
        <div className="current-track flex-col">
            <img className='curr-track-art' src={currentTrack.album.images[0].url} alt="Album Art" style={{ width: 100, height: 100 }} />
            <h2>&emsp;</h2>
            <h1>{currentTrack.name}</h1>
            <h2>{currentTrack.artists.map(a => a.name).join(', ')}</h2>
        </div>
    );
}