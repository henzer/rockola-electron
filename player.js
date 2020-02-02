const { app, BrowserWindow, dialog, globalShortcut, ipcRenderer, remote } = require('electron');
const NodeID3 = require('node-id3');
const { isAudioFile, isVideoFile } = require("./files-reader");
const Store = require('electron-store');
const store = new Store();
const playList = [];

const pickSong = () => {
    if (playList.length) {
        return playList[0];
    }
    return undefined;
};

const removeSong = () => {
    if (playList.length) {
        playList.splice(0, 1);
        store.set("playList", playList);
    }
};

const playSong = (song) => {
    $('#audio-player-image, #audio-player, #video-player').hide();
    if (isAudioFile(song.path)) {
        playAudio(song);
    } else if (isVideoFile(song.path)) {
        playVideo(song);
    }
};

const playAudio = (song) => {
    let tags = NodeID3.read(song.path);
    const image = tags.image;
    $("#audio-player-image").attr("src", "data:" + image.mime + ";base64," + image.imageBuffer.toString('base64'));
    $("#audio-source").attr("src", song.path);
    $('#audio-player-image, #audio-player').show();
    const player = $("#audio-player")[0];
    player.pause();
    player.load();
    player.oncanplaythrough = player.play();
}

const playVideo = (video) => {
    $('#video-source').attr('src', video.path);
    $('#video-player').show();
    const player = $("#video-player")[0];
    player.pause();
    player.load();
    player.oncanplaythrough = player.play();
};

ipcRenderer.on('addSong', (event, song) => {
    console.log('Playing: ', song);
    playList.push(song);

    if (playList.length === 1) {
        const song = pickSong();
        playSong(song);
    }

    store.set('playList', playList);
    console.log(store.get("playList"));
});

$("#audio-player, #video-player").on("ended", () => {
    removeSong();
    const song = pickSong();
    if (song) {
        playSong(song);
    }
});

window.addEventListener('keydown', () => {
    ipcRenderer.send('showRockola');
}, true)
