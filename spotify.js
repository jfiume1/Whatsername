const SPOTIFY_API_BASE = 'https://api.spotify.com/v1/me/player/currently-playing';

async function getSpotifyCurrentlyPlaying() {
    try {
        const response = await fetch(SPOTIFY_API_BASE, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            const track_name = data.item.name;
            const artist = data.item.artists[0].name;
            
            return { track_name, artist };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching currently playing track:', error);
        return null;
    }
}

module.exports = { getSpotifyCurrentlyPlaying };
