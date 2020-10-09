const { app, BrowserWindow, dialog, globalShortcut, ipcRenderer, remote } = require('electron');
const NodeID3 = require('node-id3');
const { isAudioFile, isVideoFile } = require("./files-reader");
const { pickSong, removeSong, addSong, isEmpty, getPlayList } = require('./play-list');
const Store = require('electron-store');

const playSong = (song) => {
    $('#audio-player-image, #audio-player, #video-player').hide();
    if (isAudioFile(song.path)) {
        playAudio(song);
    } else if (isVideoFile(song.path)) {
        playVideo(song);
    } else {
        console.log('Formato no soportado: ', song);
    }
};

const playAudio = (song) => {
    try {
        let tags = NodeID3.read(song.path);
        const image = tags.image;
        console.log(tags);
        if (image && image.mime && image.imageBuffer) {
            $("#audio-player-image").attr("src", "data:" + image.mime + ";base64," + image.imageBuffer.toString('base64'));
        }
        $("#audio-source").attr("src", song.path);
        $('#audio-player-image, #audio-player').show();
        const player = $("#audio-player")[0];
        player.pause();
        player.load();
        player.oncanplaythrough = player.play();
    } catch(exception) {
        console.log('Ocurrio un error: ', exception);
        console.log('Reproduciendo siguiente cancion');
        removeSong();
        const song = pickSong();
        if (song) {
            playSong(song);
        }
    }

}

const playVideo = (video) => {
    $('#video-source').attr('src', video.path);
    $('#video-player').show();
    const player = $("#video-player")[0];
    player.pause();
    player.load();
    player.oncanplaythrough = player.play();
    // openFullscreen(player);

};

function openFullscreen(video) {
    console.log("hitting");
    console.log(video);
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { /* Firefox */
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE/Edge */
        video.msRequestFullscreen();
    }
}

ipcRenderer.on('addSong', (event, song) => {
    addSong(song);
    if (getPlayList().length === 1) {
        const song = pickSong();
        playSong(song);
    }
    // playSong(song);
});

$("#audio-player, #video-player").on("ended", () => {
    removeSong();
    const song = pickSong();
    if (song) {
        playSong(song);
    } else {
        ipcRenderer.send('showRockola');
    }
});

window.addEventListener('keydown', () => {
    ipcRenderer.send('showRockola');
}, true)
