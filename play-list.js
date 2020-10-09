const Store = require('electron-store');
const store = new Store();
let playList = store.get('playList', []);

function addSong(song) {
    playList = store.get('playList', []);
    playList.push(song);
    store.set('playList', playList);
};

function removeSong() {
    playList = store.get('playList', []);
    if (playList.length) {
        playList.splice(0, 1);
        store.set("playList", playList);
    }
};

function isEmpty() {
    playList = store.get('playList', []);
    return !playList.length;

};

function pickSong() {
    playList = store.get('playList', []);
    if (playList.length) {
        return playList[0];
    }
    return undefined;
};

function getPlayList() {
    return store.get('playList', []);
}

module.exports = {
    addSong: addSong,
    removeSong: removeSong,
    isEmpty: isEmpty,
    pickSong: pickSong,
    getPlayList: getPlayList
};