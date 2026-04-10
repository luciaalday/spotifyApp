// src/spotify/api.js
const BASE = "https://api.spotify.com/v1";

function getHeaders() {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found. Please log in.");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token, please log in again.");

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
        }),
    });

    if (!res.ok) throw new Error("Failed to refresh token, please log in again.");

    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
}

async function fetchWithAuth(url, options = {}) {
    options.headers = getHeaders();
    let res = await fetch(url, options);

    if (res.status === 401) {
        await refreshAccessToken();
        options.headers = getHeaders();
        res = await fetch(url, options);
    }

    if (!res.ok && res.status !== 204) throw new Error(`Spotify API error: ${res.status}`);
    return res;
}

export async function getCurrentUser() {
    const res = await fetchWithAuth(`${BASE}/me`);
    return res.json();
}

export async function getPlaybackState() {
    const res = await fetchWithAuth(`${BASE}/me/player`);
    return res.json();
}

export async function getCurrentlyPlaying() {
    const res = await fetchWithAuth(`${BASE}/me/player/currently-playing`);
    if (res.status === 204) return null;
    return res.json();
}

export async function getRecentlyPlayed(limit = 20) {
    const res = await fetchWithAuth(`${BASE}/me/player/recently-played?limit=${limit}`);
    return res.json();
}

export async function pausePlayback() {
    await fetchWithAuth(`${BASE}/me/player/pause`, { method: "PUT" });
}

export async function resumePlayback() {
    await fetchWithAuth(`${BASE}/me/player/play`, { method: "PUT" });
}

export async function skipToNext() {
    await fetchWithAuth(`${BASE}/me/player/next`, { method: "POST" });
}

export async function skipToPrevious() {
    await fetchWithAuth(`${BASE}/me/player/previous`, { method: "POST" });
}

export async function setVolume(volumePercent) {
    await fetchWithAuth(`${BASE}/me/player/volume?volume_percent=${volumePercent}`, { method: "PUT" });
}

// Tracks

export async function getTopTracks(timeRange = "medium_term", limit = 20) {
    const res = await fetchWithAuth(`${BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    return res.json();
}

export async function getTrack(trackId) {
    const res = await fetchWithAuth(`${BASE}/tracks/${trackId}`);
    return res.json();
}

export async function getSavedTracks(limit = 20, offset = 0) {
    const res = await fetchWithAuth(`${BASE}/me/tracks?limit=${limit}&offset=${offset}`);
    return res.json();
}

export async function saveTrack(trackId) {
    await fetchWithAuth(`${BASE}/me/tracks`, {
        method: "PUT",
        body: JSON.stringify({ ids: [trackId] }),
    });
}

export async function removeTrack(trackId) {
    await fetchWithAuth(`${BASE}/me/tracks`, {
        method: "DELETE",
        body: JSON.stringify({ ids: [trackId] }),
    });
}

// Artists

export async function getTopArtists(timeRange = "medium_term", limit = 20) {
    const res = await fetchWithAuth(`${BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    return res.json();
}

export async function getArtist(artistId) {
    const res = await fetchWithAuth(`${BASE}/artists/${artistId}`);
    return res.json();
}

export async function getArtistTopTracks(artistId, market = "US") {
    const res = await fetchWithAuth(`${BASE}/artists/${artistId}/top-tracks?market=${market}`);
    return res.json();
}

export async function followArtist(artistId) {
    await fetchWithAuth(`${BASE}/me/following?type=artist`, {
        method: "PUT",
        body: JSON.stringify({ ids: [artistId] }),
    });
}

// Playlists

export async function getUserPlaylists(limit = 20) {
    const res = await fetchWithAuth(`${BASE}/me/playlists?limit=${limit}`);
    return res.json();
}

export async function getPlaylist(playlistId) {
    const res = await fetchWithAuth(`${BASE}/playlists/${playlistId}`);
    return res.json();
}

export async function createPlaylist(userId, name, description = "", isPublic = false) {
    const res = await fetchWithAuth(`${BASE}/users/${userId}/playlists`, {
        method: "POST",
        body: JSON.stringify({ name, description, public: isPublic }),
    });
    return res.json();
}

export async function addTracksToPlaylist(playlistId, trackUris) {
    const res = await fetchWithAuth(`${BASE}/playlists/${playlistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({ uris: trackUris }),
    });
    return res.json();
}

// Albums

export async function getAlbum(albumId) {
    const res = await fetchWithAuth(`${BASE}/albums/${albumId}`);
    return res.json();
}

export async function getSavedAlbums(limit = 20) {
    const res = await fetchWithAuth(`${BASE}/me/albums?limit=${limit}`);
    return res.json();
}

// Search

export async function search(query, types = ["track", "artist", "album"], limit = 10) {
    const typeStr = types.join(",");
    const res = await fetchWithAuth(
        `${BASE}/search?q=${encodeURIComponent(query)}&type=${typeStr}&limit=${limit}`
    );
    return res.json();
}

// Recommendations

export async function getRecommendations({ seedTracks = [], seedArtists = [], seedGenres = [], limit = 20 }) {
    const params = new URLSearchParams({ limit });
    if (seedTracks.length) params.set("seed_tracks", seedTracks.join(","));
    if (seedArtists.length) params.set("seed_artists", seedArtists.join(","));
    if (seedGenres.length) params.set("seed_genres", seedGenres.join(","));

    const res = await fetchWithAuth(`${BASE}/recommendations?${params}`);
    return res.json();
}