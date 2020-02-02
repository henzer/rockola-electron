const fs = require('fs');
const fileExtension = require("file-extension");

function readMusic(path) {
    const artists = [];
    const albums = fs.readdirSync(path, {withFileTypes: true});
    albums.forEach(album => {
        if (album.isDirectory) {
            const listSongs = fs.readdirSync(path + '/' + album.name);
            const songs = listSongs.map( song => {
                const songPath = path + '/' + album.name + '/' + song;
                return {
                    path: songPath,
                    name: song, //Add more info here
                };
            });
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
    return ['mp3', 'ogg', 'wav'].includes(extension);
};

const isVideoFile = (fileName) => {
    const extension = fileExtension(fileName);
    return ['mp4', 'webm', 'ogg'].includes(extension);
};

module.exports = {
    readMusic: readMusic,
    isAudioFile: isAudioFile,
    isVideoFile: isVideoFile,
};

