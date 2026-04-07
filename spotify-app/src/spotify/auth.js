// src/spotify/auth.js
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "https://spotify.luciaalday.com/callback";
// const REDIRECT_URI = "http://127.0.0.1:5173/callback";
const SCOPES = "user-read-private user-read-email user-top-read user-read-currently-playing";

// Generate random string for PKCE code verifier
export function generateCodeVerifier(length = 128) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(randomValues).map(x => chars[x % chars.length]).join('');
}

// SHA-256 hash → base64url string
export async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Redirect user to Spotify auth page
export async function loginWithSpotify() {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("code_verifier", verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code) {
    const verifier = localStorage.getItem("code_verifier");
    if (!verifier) throw new Error("Missing code verifier");

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    const data = await res.json();
    console.log("TOKEN RESPONSE:", data);

    if (!data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);

    localStorage.setItem("access_token", data.access_token);
    return data;
}