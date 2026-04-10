import { useState, useEffect } from 'react';
import { getTopArtists } from '../spotify/api';

export default function TopArtists() {
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(20);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const data = await getTopArtists(timeRange, limit);
                setArtists(data.items);
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
                &nbsp;Artists
            </h1>
            <div className="flex-row  time-range-options">
                <button onClick={()=>setTimeRange("short_term")} >Last month</button>
                <button onClick={()=>setTimeRange("medium_term")} >Last 6 months</button>
                <button onClick={()=>setTimeRange("long_term")} >All time</button>
            </div>
            <hr />
            <div>
                {artists.map((artist, idx) => (
                    <div key={artist.id} className="flex-row text-glow">
                        <h3 style={{ width: 30 }}> {idx + 1} </h3>
                        <img className='track-art' src={artist.images[0].url} alt="Artist Image" style={{ width: 60, height: 60 }} />
                        <div className='current-track'>
                            <h1>{artist.name}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}