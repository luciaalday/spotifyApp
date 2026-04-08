import { useState, useEffect } from 'react';
import { getTopTracks } from '../spotify/api';

export default function TopTracks() {
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(20);
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const data = await getTopTracks(timeRange, limit);
                setTracks(data.items);
            } catch (err) {
                console.error("Error fetching top tracks:", err);
            }
        };
        fetchTopTracks();
    }, [timeRange, limit]);


    return (
        <main className='main-content'>
            <h1>Top&nbsp;
                <input className='limit-input'
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    min="1"
                    max="50"
                />    
                &nbsp;Tracks
            </h1>
            <div className="flex-row  time-range-options">
                <button onClick={()=>setTimeRange("short_term")} >Last month</button>
                <button onClick={()=>setTimeRange("medium_term")} >Last 6 months</button>
                <button onClick={()=>setTimeRange("long_term")} >All time</button>
            </div>
            <hr />
            <div>
                {tracks.map((track, idx) => (
                    <div key={track.id} className="flex-row text-glow">
                        <h3 style={{ width: 30 }}> {idx + 1} </h3>
                        <img className='track-art' src={track.album.images[0].url} alt="Album Art" style={{ width: 60, height: 60 }} />
                        <div className='current-track' style={{ margin:'0'}}>
                            <h1>{track.name}</h1>
                            <h2>{track.artists.map(a => a.name).join(', ')}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}