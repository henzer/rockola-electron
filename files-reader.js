const path = require('path');
const fs = require('fs');
const dataurl = require('dataurl');

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

const convertSong = (filePath) => {
    const songPromise = new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) { reject(err); }
        resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
      });
    });
    return songPromise;
  };

module.exports = {
    readMusic: readMusic,
    convertSong: convertSong,
};

