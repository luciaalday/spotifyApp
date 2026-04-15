export default function Basic({ tracks, artists }) {
    return (
        <div className="flex-row space-between" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '0 1 auto', maxWidth: '45%' }}>
                <table>
                    <tbody>
                        {tracks && tracks.map((track, idx) => (
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
                        {artists && artists.map((artist, idx) => (
                            <div key={artist.id} className="flex-row center fade-out text-glow">
                                <h3 style={{ width: 30 }}> {idx + 1} </h3>
                                <img className='track-art' src={artist.images[0].url} alt="Artist Image" style={{ width: 60, height: 60 }} />
                                <div className='current-track'>
                                    <h1>{artist.name}</h1>
                                </div>
                            </div>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}