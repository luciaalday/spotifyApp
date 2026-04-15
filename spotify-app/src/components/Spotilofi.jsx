const timingFns = ['linear', 'ease-in', 'ease-out', 'ease-in-out'];

function randBetween(min, max, decimals = 1) {
    return +(Math.random() * (max - min) + min).toFixed(decimals);
}

function generateWindows(count) {
    return Array.from({ length: count }, () => ({
        delay: randBetween(0.1, 5),
        duration: randBetween(8, 15),
        timing: timingFns[Math.floor(Math.random() * timingFns.length)]
    }));
}

function windowsPerHeight(heightPx, windowH = 5, margin = 20, padding = 20) {
    return 2 * Math.max(1, Math.floor((heightPx - padding) / (windowH + margin)));
}

function Windows({ heightPx }) {
    return generateWindows(windowsPerHeight(heightPx)).map((w, i) => (
        <div key={i} className='window' style={{
            animationDelay: `${w.delay}s`,
            animationDuration: `${w.duration}s`,
            animationTimingFunction: w.timing
        }} />
    ));
}

export default function Spotilofi({ tracks }) {
    const formatDuration = (ms) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    if (!tracks.length) return null;

    const heights = {
        1: tracks.length * 8,
        2: tracks.length * 21,
        3: tracks.length * 12,
        4: tracks.length * 10,
        5: tracks.length * 18,
        6: tracks.length * 6,
    };

    return (
        <div className='view-container'>
            <div className='lofi'>
                <div className='img-container'>
                    <div className='side-building no-1' style={{ height: `${heights[1]}px` }}>
                        <Windows heightPx={heights[1]} />
                    </div>
                    <div className='side-building no-2' style={{ height: `${heights[2]}px` }}>
                        <Windows heightPx={heights[2]} />
                    </div>
                    <div className='side-building no-3' style={{ height: `${heights[3]}px` }}>
                        <Windows heightPx={heights[3]} />
                    </div>
                    <div className='main-building'>
                        {tracks.map((track, idx) => (
                            <div key={track.id} className="flex-row text-glow ranks">
                                <h3 style={{ width: 30 }}>{idx + 1}</h3>
                                <span>{track.name}</span>
                                <span>{formatDuration(track.duration_ms)}</span>
                            </div>
                        ))}
                    </div>
                    <div className='side-building no-4' style={{ height: `${heights[4]}px` }}>
                        <Windows heightPx={heights[4]} />
                    </div>
                    <div className='side-building no-5' style={{ height: `${heights[5]}px` }}>
                        <Windows heightPx={heights[5]} />
                    </div>
                    <div className='side-building no-6' style={{ height: `${heights[6]}px` }}>
                        <Windows heightPx={heights[6]} />
                    </div>
                </div>
            </div>
        </div>
    );
}