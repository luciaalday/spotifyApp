export default function Basic({ tracks, artists }) {
    return (
        <div className="flex-row space-between" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '0 1 auto', maxWidth: '45%' }}>
                {tracks && tracks.map((track, idx) => (
                    <div key={track.id} className="flex-row center fade-out text-glow">
                        <h3 style={{ width: 30 }}> {idx + 1} </h3>
                        <img className='track-art' src={track.album.images[0].url} alt="Album Art" style={{ width: 60, height: 60 }} />
                        <div className='current-track'>
                            <h1>{track.name}</h1>
                            <h2>{track.artists.map(a => a.name).join(', ')}</h2>
                        </div>
                    </div>
                ))}
                {artists && artists.map((artist, idx) => (
                    <div key={artist.id} className="flex-row center fade-out text-glow">
                        <h3 style={{ width: 30 }}> {idx + 1} </h3>
                        <img className='track-art' src={artist.images[0].url} alt="Artist Image" style={{ width: 60, height: 60 }} />
                        <div className='current-track'>
                            <h1>{artist.name}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}