// src/spotify/api.js
const BASE = "https://api.spotify.com/v1";

function getHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

export async function getCurrentUser() {
    const res = await fetch(`${BASE}/me`, { headers: getHeaders() });
    return res.json();
}

export async function getCurrentlyPlaying() {
    const res = await fetch(`${BASE}/me/player/currently-playing`, { headers: getHeaders() });
    if (res.status === 204) return null;
    return res.json();
}

export async function getRecentlyPlayed(limit = 20) {
    const res = await fetch(`${BASE}/me/player/recently-played?limit=${limit}`, { headers: getHeaders() });
    return res.json();
}

export async function getPlaybackState() {
    const res = await fetch(`${BASE}/me/player`, { headers: getHeaders() });
    if (res.status === 204) return null;
    return res.json();
}

export async function pausePlayback() {
    await fetch(`${BASE}/me/player/pause`, { method: "PUT", headers: getHeaders() });
}

export async function resumePlayback() {
    await fetch(`${BASE}/me/player/play`, { method: "PUT", headers: getHeaders() });
}

export async function skipToNext() {
    await fetch(`${BASE}/me/player/next`, { method: "POST", headers: getHeaders() });
}

export async function skipToPrevious() {
    await fetch(`${BASE}/me/player/previous`, { method: "POST", headers: getHeaders() });
}

export async function setVolume(volumePercent) {
    await fetch(`${BASE}/me/player/volume?volume_percent=${volumePercent}`, {
        method: "PUT",
        headers: getHeaders(),
    });
}

// Tracks 

export async function getTopTracks(timeRange = "medium_term", limit = 20) {
    // timeRange: "short_term" (4 weeks) | "medium_term" (6 months) | "long_term" (all time)
    const res = await fetch(
        `${BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
        { headers: getHeaders() }
    );
    return res.json();
}

export async function getTrack(trackId) {
    const res = await fetch(`${BASE}/tracks/${trackId}`, { headers: getHeaders() });
    return res.json();
}

export async function getSavedTracks(limit = 20, offset = 0) {
    const res = await fetch(
        `${BASE}/me/tracks?limit=${limit}&offset=${offset}`,
        { headers: getHeaders() }
    );
    return res.json();
}

export async function saveTrack(trackId) {
    await fetch(`${BASE}/me/tracks`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ ids: [trackId] }),
    });
}

export async function removeTrack(trackId) {
    await fetch(`${BASE}/me/tracks`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ ids: [trackId] }),
    });
}

// Artists 

export async function getTopArtists(timeRange = "medium_term", limit = 20) {
    const res = await fetch(
        `${BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
        { headers: getHeaders() }
    );
    return res.json();
}

export async function getArtist(artistId) {
    const res = await fetch(`${BASE}/artists/${artistId}`, { headers: getHeaders() });
    return res.json();
}

export async function getArtistTopTracks(artistId, market = "US") {
    const res = await fetch(
        `${BASE}/artists/${artistId}/top-tracks?market=${market}`,
        { headers: getHeaders() }
    );
    return res.json();
}

export async function followArtist(artistId) {
    await fetch(`${BASE}/me/following?type=artist`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ ids: [artistId] }),
    });
}

// Playlists 

export async function getUserPlaylists(limit = 20) {
    const res = await fetch(`${BASE}/me/playlists?limit=${limit}`, { headers: getHeaders() });
    return res.json();
}

export async function getPlaylist(playlistId) {
    const res = await fetch(`${BASE}/playlists/${playlistId}`, { headers: getHeaders() });
    return res.json();
}

export async function createPlaylist(userId, name, description = "", isPublic = false) {
    const res = await fetch(`${BASE}/users/${userId}/playlists`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, description, public: isPublic }),
    });
    return res.json();
}

export async function addTracksToPlaylist(playlistId, trackUris) {
    // trackUris: array of "spotify:track:XXXX" strings
    const res = await fetch(`${BASE}/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ uris: trackUris }),
    });
    return res.json();
}

// Albums 

export async function getAlbum(albumId) {
    const res = await fetch(`${BASE}/albums/${albumId}`, { headers: getHeaders() });
    return res.json();
}

export async function getSavedAlbums(limit = 20) {
    const res = await fetch(`${BASE}/me/albums?limit=${limit}`, { headers: getHeaders() });
    return res.json();
}

// Search 

export async function search(query, types = ["track", "artist", "album"], limit = 10) {
    // types: any combo of "track", "artist", "album", "playlist"
    const typeStr = types.join(",");
    const res = await fetch(
        `${BASE}/search?q=${encodeURIComponent(query)}&type=${typeStr}&limit=${limit}`,
        { headers: getHeaders() }
    );
    return res.json();
}

// Recommendations 

export async function getRecommendations({ seedTracks = [], seedArtists = [], seedGenres = [], limit = 20 }) {
    const params = new URLSearchParams({ limit });
    if (seedTracks.length) params.set("seed_tracks", seedTracks.join(","));
    if (seedArtists.length) params.set("seed_artists", seedArtists.join(","));
    if (seedGenres.length) params.set("seed_genres", seedGenres.join(","));

    const res = await fetch(`${BASE}/recommendations?${params}`, { headers: getHeaders() });
    return res.json();
}