const fs = require('fs');
const fileExtension = require("file-extension");
const supportedAudios = ['mp3', 'ogg', 'wav'];
const supportedVideos = ['mp4', 'webm', 'ogg'];

function readMusic(path) {
    const artists = [];
    const albums = fs.readdirSync(path, {withFileTypes: true});
    albums.forEach(album => {
        if (album.isDirectory) {
            const listSongs = fs.readdirSync(path + '/' + album.name);
            const songs = listSongs.map( song => {
                const songPath = path + '/' + album.name + '/' + song;
                console.log('Song: ', song);
                console.log('Extension: ', fileExtension(songPath) !== 'jpg');
                return {
                    path: songPath,
                    name: song, //Add more info here
                };
            }).filter(song => fileExtension(song.path) !== 'jpg');
            const artist = {
                name: album.name,
                songs: songs,
                path: path + '/' + album.name + '/',
            };
            artists.push(artist);
        }
    });
    return artists;
};

const isAudioFile = (fileName) => {
    const extension = fileExtension(fileName);
    return supportedAudios.includes(extension);
};

const isVideoFile = (fileName) => {
    const extension = fileExtension(fileName);
    return supportedVideos.includes(extension);
};

module.exports = {
    readMusic: readMusic,
    isAudioFile: isAudioFile,
    isVideoFile: isVideoFile,
};

