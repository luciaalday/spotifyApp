import { useState, useEffect, useRef } from 'react';
import { getTopTracks } from '../spotify/api';
import Basic from '../components/Basic';
import Spotilofi from '../components/Spotilofi';
import Prairie from '../components/Prarie';
import html2canvas from 'html2canvas';
import { IoDownload } from 'react-icons/io5';

export default function TopTracks() {
    const [timeRange, setTimeRange] = useState("medium_term");
    const [limit, setLimit] = useState(20);
    const [tracks, setTracks] = useState([]);
    const [view, setView] = useState('Basic');

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

    const viewComponents = {
        Basic: <Basic tracks={tracks} />,
        Lofi: <Spotilofi tracks={tracks} />,
        Prairie: <Prairie />
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
                        <button className="select" onClick={() => setTimeRange("short_term")} >Last month</button>
                        <button className="select" onClick={() => setTimeRange("medium_term")} >Last 6 months</button>
                        <button className="select" onClick={() => setTimeRange("long_term")} >All time</button>
                    </div>
                </div>
                <div className="flex-col align-between">
                    <select className="select" value={view} onChange={(e) => setView(e.target.value)}>
                        <option value="Basic">Default</option>
                        <option value="Lofi">Spoti Lofi</option>
                        <option value="Prairie">Little Spotify on the Prairie</option>
                    </select>
                    <button onClick={handleDownload} className="icon play">
                        <IoDownload size={30} />
                    </button>
                </div>
            </div>
            <hr />
                <div style={{ margin: '0', padding:'0' }} ref={imgRef} >
                    {viewComponents[view] ?? null}
                </div>
        </main>
    );
}