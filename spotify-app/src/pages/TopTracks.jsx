import { useState, useEffect, useRef } from 'react';
import { getTopTracks } from '../spotify/api';
import Spotilofi from '../components/spotilofi';
import html2canvas from 'html2canvas';
import { IoDownload } from 'react-icons/io5';

export default function TopTracks() {
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(20);
    const [tracks, setTracks] = useState([]);

    const imgRef = useRef();

    const handleDownload = async () => {
        const canvas = await html2canvas(imgRef.current, {allowTaint: true, useCORS: true});
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "top-tracks.png";
        document.body.appendChild(link);
        link.click();
    }


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
        <main>
            <div className="flex-row space-between">
                <div>
                    <h1>Top&nbsp;
                        <input
                            className='limit-input'
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            min="1"
                            max="50"
                        />
                        &nbsp;Tracks
                    </h1>
                    <div className="flex-row time-range-options">
                        <button onClick={() => setTimeRange("short_term")}>Last month</button>
                        <button onClick={() => setTimeRange("medium_term")}>Last 6 months</button>
                        <button onClick={() => setTimeRange("long_term")}>All time</button>
                    </div>
                </div>
                <div>
                    <button onClick={handleDownload} className="icon play">
                        <IoDownload size={30} />
                    </button>
                </div>
            </div>
            <hr />
            {/**
            <div className="flex-row space-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: '0 1 auto', maxWidth: '45%' }}>
                    <table>
                        <tbody>
                            {tracks.map((track, idx) => (
                                <tr key={track.id}>
                                    <td><h3 style={{ width: 30 }}>{idx + 1}</h3></td>
                                    <td><img className='track-art' src={track.album.images[0].url} alt="Album Art" style={{ width: 60, height: 60 }} /></td>
                                    <td>
                                        <div className='current-track' style={{ margin: '0' }}>
                                            <h1>{track.name}</h1>
                                            <h2>{track.artists.map(a => a.name).join(', ')}</h2>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            */}
                <div style={{ flex: '0 1 auto', margin: '0', padding:'0' }} ref={imgRef} >
                    <Spotilofi tracks={tracks} />
                </div>
        </main>
    );
}