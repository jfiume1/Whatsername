const LYRICS_API_BASE = 'https://api.lyrics.ovh/v1';

async function getLyrics(track, artist) {
    try {
        const response = await fetch(`${LYRICS_API_BASE}/${artist}/${track}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (data.lyrics) {
            return data.lyrics.split('\n');
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return [];
    }
}

module.exports = { getLyrics };
