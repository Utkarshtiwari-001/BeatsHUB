document.addEventListener('DOMContentLoaded', function() {
    // Sample music data organized by categories
    const musicData = {
        trending: [
            { id: 1, title: "LAAL PARI", artist: "The Weeknd", image: "laalpari.jpg", audio: "LAAL_PARI.mp3" },
            { id: 2, title: "Courtside", artist: "The Weeknd", image: "courtside.jpg", audio: "CourtSide.mp3" },
            { id: 3, title: "Levitating", artist: "Dua Lipa", image: "levitating.jpg", audio: "Levitating.mp3" }
        ],
        hiphop: [
            { id: 4, title: "Millionaire", artist: "Drake", image: "millionaire.jpg", audio: "Millionaire.mp3" },
            { id: 5, title: "Russian Bandana", artist: "Travis Scott", image: "russian bandana.jpg", audio: "RussianBandana.mp3" },
            { id: 6, title: "Knock Knock", artist: "Kendrick Lamar", image: "knockknock.jpg", audio: "KnockKnock.mp3" }
        ],
        party: [
            { id: 7, title: "Taki Taki", artist: "DJ Snake", image: "taki taki.jpg", audio: "TakiTaki.mp3" },
            { id: 8, title: "Kala Chashma", artist: "Ed Sheeran", image: "kala chashma.jpg", audio: "KalaChashma.mp3" },
            { id: 9, title: "Ghungroo", artist: "Bruno Mars", image: "ghungroo.jpg", audio: "Ghungroo.mp3" }
        ],
        romantic: [
            { id: 10, title: "Kabhi Jo Badal Barse", artist: "Ed Sheeran", image: "KabhiBadal.jpg", audio: "KabhiJoBadal.mp3" },
            { id: 11, title: "Jeene Laga Hoon", artist: "John Legend", image: "JeeneLaga.jpg", audio: "JeeneLaga.mp3" },
            { id: 12, title: "Bol Halke Halke", artist: "Ed Sheeran", image: "halkehalke.jpg", audio: "HalkeHalke.mp3" }
        ],
        bollywood: [
            { id: 13, title: "Afghan Jalebi", artist: "Arijit Singh", image: "bollyAfghan.jpg", audio: "AfghanJalebi.mp3" },
            { id: 14, title: "Dil Ye Bekarar", artist: "Arijit Singh", image: "bollyDilyebekarar.jpg", audio: "DilYeBekraar.mp3" },
            { id: 15, title: "Aaj Ki Raat", artist: "Arijit Singh", image: "bollyaajkiraat.jpg", audio: "AajKiRaat.mp3" }
        ],
        english: [
            { id: 16, title: "On My Way", artist: "Queen", image: "engAlanwalker.png", audio: "OnMyWay.mp3" },
            { id: 17, title: "Believer", artist: "Eagles", image: "engBeliever.webp", audio: "Believer.mp3" },
            { id: 18, title: "HeatWaves", artist: "Guns N' Roses", image: "engHeatWaves.jpg", audio: "HeatWaves.mp3" }
        ]
    };

    // DOM Elements
    const playerThumbnail = document.getElementById('player-thumbnail');
    const playerSongTitle = document.getElementById('player-song-title');
    const playerArtist = document.getElementById('player-artist');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const muteBtn = document.getElementById('mute-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Audio Element
    const audio = new Audio();
    let isPlaying = false;
    let currentSong = null;
    let currentCategory = null;

    // Initialize the app
    function init() {
        // Configure audio element
        audio.preload = "auto";
        audio.volume = 0.7;
        volumeBar.value = 0.7;
        
        // Set up audio event listeners
        audio.addEventListener('canplay', () => {
            console.log("Audio is ready to play");
        });
        
        audio.addEventListener('error', (e) => {
            console.error("Audio error:", e.target.error);
            alert("Error loading audio file");
        });
        
        renderAllCategories();
        setupEventListeners();
    }

    // Render all music categories
    function renderAllCategories() {
        for (const category in musicData) {
            renderCategory(category);
        }
    }

    // Render a specific category
    function renderCategory(category) {
        const section = document.getElementById(category);
        if (!section) return;
        
        const grid = section.querySelector('.songs-grid');
        grid.innerHTML = '';
        
        musicData[category].forEach(song => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <div class="song-image-container">
                    <img src="${song.image}" alt="${song.title}" class="song-image">
                </div>
                <div class="song-info">
                    <h3 class="song-title">${song.title}</h3>
                    <p class="song-artist">${song.artist}</p>
                </div>
            `;
            songCard.addEventListener('click', () => {
                console.log("Playing:", song.title); // Debug click
                playSong(song, category);
            });
            grid.appendChild(songCard);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Play/Pause button
        playBtn.addEventListener('click', togglePlay);

        // Previous button
        prevBtn.addEventListener('click', playPreviousSong);

        // Next button
        nextBtn.addEventListener('click', playNextSong);

        // Progress bar
        progressBar.addEventListener('input', setProgress);

        // Time update
        audio.addEventListener('timeupdate', updateProgress);

        // Song ended
        audio.addEventListener('ended', playNextSong);

        // Volume control
        volumeBar.addEventListener('input', setVolume);

        // Mute button
        muteBtn.addEventListener('click', toggleMute);

        // Download button
        downloadBtn.addEventListener('click', downloadSong);
    }

    // Play song
    function playSong(song, category) {
        currentSong = song;
        currentCategory = category;
        
        playerThumbnail.src = song.image;
        playerSongTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        
        // Pause current audio first
        audio.pause();
        
        // Set new source
        audio.src = song.audio;
        
        // Load the audio
        audio.load();
        
        // Update download button
        downloadBtn.setAttribute('data-src', song.audio);
        downloadBtn.setAttribute('data-filename', `${song.title} - ${song.artist}.mp3`);
        
        // Only play if already playing
        if (isPlaying) {
            audio.play().catch(e => {
                console.error("Playback failed:", e);
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                alert("Please click the play button to start playback");
            });
        }
    }

    // Play audio
    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(e => {
            console.error("Playback failed:", e);
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            alert("Please click the play button to start playback");
        });
    }

    // Pause audio
    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    // Toggle play/pause
    function togglePlay() {
        if (!currentSong) {
            // If no song is selected, play the first song from trending
            if (musicData.trending.length > 0) {
                playSong(musicData.trending[0], 'trending');
                playAudio();
            }
            return;
        }
        
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    // Play previous song
    function playPreviousSong() {
        if (!currentSong || !currentCategory) return;
        
        const categorySongs = musicData[currentCategory];
        const currentIndex = categorySongs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + categorySongs.length) % categorySongs.length;
        
        playSong(categorySongs[prevIndex], currentCategory);
        if (isPlaying) {
            playAudio();
        }
    }

    // Play next song
    function playNextSong() {
        if (!currentSong || !currentCategory) return;
        
        const categorySongs = musicData[currentCategory];
        const currentIndex = categorySongs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % categorySongs.length;
        
        playSong(categorySongs[nextIndex], currentCategory);
        if (isPlaying) {
            playAudio();
        }
    }

    // Update progress bar
    function updateProgress() {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // Update time display
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        
        if (!isNaN(durationSeconds)) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    // Set progress
    function setProgress() {
        const progress = progressBar.value;
        const duration = audio.duration;
        audio.currentTime = (progress / 100) * duration;
    }

    // Set volume
    function setVolume() {
        audio.volume = volumeBar.value;
        
        // Update mute button icon
        if (audio.volume === 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Toggle mute
    function toggleMute() {
        if (audio.volume > 0) {
            audio.volume = 0;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeBar.value = 0;
        } else {
            audio.volume = 0.7;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeBar.value = 0.7;
        }
    }

    // Download song
    function downloadSong() {
        const songSrc = downloadBtn.getAttribute('data-src');
        const filename = downloadBtn.getAttribute('data-filename');
        
        if (songSrc) {
            const link = document.createElement('a');
            link.href = songSrc;
            link.download = filename || 'song.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('No song selected to download');
        }
    }

    // Initialize the app
    init();
});