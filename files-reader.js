const path = require('path');
const fs = require('fs');

function readMusic(path) {
    const artists = [];
    const albums = fs.readdirSync(path, {withFileTypes: true});
    albums.forEach(album => {
        if (album.isDirectory) {
            const songs = fs.readdirSync(path + '/' + album.name);
            console.log(album);
            const artist = {
                name: album.name,
                songs: songs,
                path: path + '/' + album.name + '/',
            };
            artists.push(artist);
            songs.forEach(song => {
                console.log(song);
            });
        }
    });
    return artists;
};

module.exports = {
    readMusic: readMusic
};

