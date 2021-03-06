const fs = require('fs');
const fileExtension = require("file-extension");
const supportedAudios = ['mp3', 'ogg', 'wav', 'wma'];
const supportedVideos = ['mp4', 'webm', 'ogg', 'mpg', 'mpeg', 'avi'];

function readMusic(path) {
    const artists = [];
    const albums = fs.readdirSync(path, {withFileTypes: true});
    var image = 'picture.jpg';
    albums.forEach(album => {
        if (album.isDirectory) {
            try {
                const listSongs = fs.readdirSync(path + '/' + album.name);
                const songs = listSongs.map( song => {
                    const songPath = path + '/' + album.name + '/' + song;
                    console.log('Song: ', song);
                    return {
                        path: songPath,
                        name: song, //Add more info here
                    };
                });
                const artist = {
                    name: album.name,
                    songs: songs.filter(song => fileExtension(song.path) == 'wma' || fileExtension(song.path) == 'mp3' || fileExtension(song.path) == 'mp4'),
                    path: path + '/' + album.name + '/',
                    image: songs.filter(song => fileExtension(song.path) === 'jpg')[0],
                };
                artists.push(artist);
            } catch (error) {
                console.log(error);
            }
        }
    });
    return artists.filter(artist => artist.songs.length > 0);
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

