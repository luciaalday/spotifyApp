import { useState, useEffect } from 'react';
import { getCurrentlyPlaying, getPlaybackState, pausePlayback, resumePlayback, skipToNext, skipToPrevious } from '../spotify/api';
import { FaPlay, FaPause, FaForwardStep, FaBackwardStep } from 'react-icons/fa6';

export default function CurrentTrack() {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        let intervalId;
        const fetchAll = async () => {
            try {
                const [trackData, stateData] = await Promise.all([
                    getCurrentlyPlaying(),
                    getPlaybackState()
                ]);
                setCurrentTrack(trackData?.item ?? null);
                setPlay(stateData?.is_playing ?? false);
            } catch (err) {
                console.error("Error polling Spotify:", err);
            }
        };
        fetchAll();
        intervalId = setInterval(fetchAll, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (!currentTrack) return <p>No song playing</p>;

    return (
        <div className="current-track flex-col">
            <img className='curr-track-art' src={currentTrack.album.images[0].url} alt="Album Art" style={{ width: 100, height: 100 }} />
            <h2>&emsp;</h2>
            <h1>{currentTrack.name}</h1>
            <h2>{currentTrack.artists.map(a => a.name).join(', ')}</h2>
            <div className="flex-row play-controls">
                <button className='icon play' onClick={()=>skipToPrevious()} ><FaBackwardStep size={20} /></button>
                {play
                    ? <button className='icon play' onClick={() => { setPlay(false); pausePlayback(); }}><FaPause size={20} /></button>
                    : <button className='icon play' onClick={() => { setPlay(true); resumePlayback(); }}><FaPlay size={20} /></button>}
                <button className='icon play' onClick={()=>skipToNext()} ><FaForwardStep size={20} /></button>
            </div>
        </div>
    );
}