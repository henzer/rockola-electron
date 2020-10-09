const { app, BrowserWindow, dialog, globalShortcut, ipcRenderer, remote } = require('electron');
const NodeID3 = require('node-id3');
const Store = require('electron-store');
const store = new Store();

let idleTime = 0;
let selectedArtistIndex = 0;
let selectedCardIndex = 0;
let selectedSongIndex = 0;
let selectedArtist;
let selectedSong;
let interval;
let playList = [];
const carruselZise = 5;
let carrusel = [];

console.log('Starting: ', store.get('library'));

const artists = store.get('library');
let songs = artists[0].songs;

carrusel = artists.filter((artist, index) => index < carruselZise);
console.log('Carrusel: ', carrusel);

paintListArtist();
paintListSongs(0);

ipcRenderer.on('showRockola', (event) => {
    console.log('Showing Rockola first time');
    idleTime = 0;
    interval = setInterval(verifyIdleTime, 1000);
});

interval = setInterval(verifyIdleTime, 1000);

function verifyIdleTime() {
    idleTime++;
    playList = store.get("playList", []);
    if (idleTime >= 5 && playList.length) {
        console.log('List size: ', playList.length);
        ipcRenderer.send('showPlayer');
        clearInterval(interval);
    }
};


document.addEventListener('keydown', event => {
    const keyPressed = event.key;
    // console.log(keyPressed);
    if (keyPressed === "a" || keyPressed === "d") selectArtist(keyPressed);
    if (keyPressed === "s" || keyPressed === "w") selectSong(keyPressed);

    if (keyPressed === "x") {
        selectedSong = songs[selectedSongIndex];
        ipcRenderer.send('playMusic', selectedSong);
    }
    idleTime = 0;
});

function paintListArtist() {
    $('#list-artists').empty();
    let index = 0;
    carrusel.forEach(artist => {
        const image = (artist.image) ? artist.image.path : artist.path + 'picture.jpg';
        $('#list-artists').append(
            `<div class="card artist-card artist `+ (index===0 ? "active" : "")+`" id="artist-` +index+ `">
                <img src="`+ image + `" class="card-img-top artist-image">
                <div class="card-body artist-description">
                  <p class="card-title">` + artist.name + `</p>
                </div>
            </div>`
        );
        index++;
    });
}

function paintListSongs(selectedArtistIndex) {
    const artist = artists[selectedArtistIndex];
    selectedSongIndex = 0;
    songs = artist.songs;
    let index = 0;
    // console.log('Songs: ', songs);
    songs.forEach(song => {
        $('#list-songs').append(
            `<li class="list-group-item song `+(index===0 ? "active" : "")+`" id="song-`+ index +`">`+ song.name +`</li>`
        );
        index++;
    });
}

function moveRight() {
    selectedArtistIndex++;
    if (selectedCardIndex >= (carruselZise - 1)) {
        if (selectedArtistIndex === artists.length) {
            selectedArtistIndex = 0;
        }
        carrusel.push(artists[selectedArtistIndex]);
        carrusel.shift();
        paintListArtist();
    } else {
        selectedCardIndex++;
    }
}

function moveLeft() {
    selectedArtistIndex--;
    if (selectedCardIndex <= 0) {
        if (selectedArtistIndex === -1) {
            selectedArtistIndex = artists.length - 1;
        }
        carrusel.unshift(artists[selectedArtistIndex]);
        carrusel.pop();
        paintListArtist();
    } else {
        selectedCardIndex--;
    }
}

function selectArtist(keyPressed) {
    switch (keyPressed) {
        case "a":
            moveLeft();
            break;
        case "d":
            moveRight();
            break;
    }
    $(".artist").removeClass("active");
    $('#artist-' + selectedCardIndex).addClass("active");
    // console.log("selectedArtist: ", selectedArtistIndex, selectedCardIndex, " carrusel: ", carrusel);

    $("#list-songs").empty();
    paintListSongs(selectedArtistIndex);
}

function selectSong(keyPressed) {
    switch (keyPressed) {
        case "w":
            selectedSongIndex = (selectedSongIndex <= 0) ? songs.length - 1 : selectedSongIndex - 1;
            break;
        case "s":
            selectedSongIndex = (selectedSongIndex >= songs.length - 1) ? 0 : selectedSongIndex + 1;
            break;
    }
    $(".song").removeClass("active");
    $("#song-" + selectedSongIndex).addClass("active");

    keepSelectedSongVisible();
}

function keepSelectedSongVisible() {
    const activeItem = $("#list-songs .active");
    const listItems = $("#list-songs");

    if (activeItem.offset().top < listItems.offset().top) {
        listItems.scrollTop((selectedSongIndex === 0) ? 0 : listItems.scrollTop() - 49);
    }
    if ((activeItem.offset().top + activeItem.outerHeight()) > (listItems.offset().top + listItems.height())) {
        listItems.scrollTop((selectedSongIndex === songs.length - 1) ? Number.MAX_SAFE_INTEGER : listItems.scrollTop() + 49);
    }
}