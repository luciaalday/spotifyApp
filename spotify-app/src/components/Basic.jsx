export default function Basic({ tracks, artists }) {
    const toPascalCase = (str) => {
        return str
            .split(/[\s]+/)
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div className="flex-row space-between" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '0 1 auto' }}>
                {tracks && tracks.map((track, idx) => (
                    <div key={track.id} className="flex-row center fade-out text-glow">
                        <h3 className='width-30'> {idx + 1} </h3>
                        <img className='track-art' src={track.album.images[0].url} alt="Album Art" style={{ width: 60, height: 60 }} />
                        <div className='current-track' style={{margin:'0'}}>
                            <h1>{toPascalCase(track.name)}</h1>
                            <h2>{track.artists.map(a => toPascalCase(a.name)).join(', ')}</h2>
                        </div>
                    </div>
                ))}
                {artists && artists.map((artist, idx) => (
                    <div key={artist.id} className="flex-row center fade-out text-glow">
                        <h3 className='width-30' > {idx + 1} </h3>
                        <img className='track-art' src={artist.images[0].url} alt="Artist Image" style={{ width: 60, height: 60 }} />
                        <div className='current-track' style={{margin:'0'}}>
                            <h1>{toPascalCase(artist.name)}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}