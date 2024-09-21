const { getSpotifyCurrentlyPlaying } = require('./spotify.js');
const { getLyrics } = require('./lyrics.js');

let currentLyricIndex = 0;
let lyrics = [];
let syncInterval = null;

// Initialize DeskThing instance
const DeskThing = typeof global.DeskThing !== 'undefined' ? global.DeskThing : null;

if (DeskThing) {
    DeskThing.getInstance().then(instance => {
        // Fetch data (if necessary)
        instance.getData().then(data => {
            console.log("Received data:", data);
        }).catch(error => {
            console.error("Error fetching data:", error);
        });

        // Register event listeners for start, playback control, and stop
        instance.on("start", updateLyrics);
        instance.on("playbackControl", handlePlaybackControl);
        instance.on("stop", () => clearInterval(syncInterval));
    }).catch(error => {
        console.error("Error initializing DeskThing instance: " + error);
    });
} else {
    console.error("DeskThing is not available.");
}

// Define the start function to initialize the app
async function start() {
    try {
        const songData = await getSpotifyCurrentlyPlaying();
        if (songData) {
            const { track_name, artist, playback_position } = songData;

            // Fetch lyrics based on the current track and artist
            lyrics = await getLyrics(track_name, artist);

            if (lyrics && lyrics.length > 0) {
                syncLyricsWithSpotify(playback_position);
            } else {
                console.error('No lyrics found!');
            }
        } else {
            console.log("No song playing currently.");
        }
    } catch (error) {
        console.error("Error retrieving song or lyrics: " + error);
    }
}

// Function to handle Spotify playback control
async function handlePlaybackControl(request) {
    let response;
    switch (request) {
        case "next":
            response = await spotify.next();
            break;
        case "previous":
            response = await spotify.previous();
            break;
        case "play":
            response = await spotify.play();
            break;
        case "pause":
            response = await spotify.pause();
            break;
    }
    DeskThing.sendLog(response);
}

// Function to display lyrics on screen
function displayLyrics() {
    const lyricsContainer = document.getElementById('lyrics-text');
    lyricsContainer.innerHTML = ""; // Clear previous lyrics

    if (currentLyricIndex < lyrics.length) {
        lyricsContainer.innerHTML = `
            <span class="highlight">${lyrics[currentLyricIndex]}</span><br/>
            ${(lyrics[currentLyricIndex + 1] || "")}
        `;
        currentLyricIndex++;
        syncInterval = setTimeout(displayLyrics, 3000); // Adjust timing based on song playback
    } else {
        currentLyricIndex = 0;
    }
}

// Sync lyrics with Spotify playback position
function syncLyricsWithSpotify(playbackPosition) {
    currentLyricIndex = Math.floor(playbackPosition / 3000); // Display each lyric for 3 seconds
    displayLyrics();
}

start();
