console.log('Hola');
const { app, BrowserWindow, dialog, globalShortcut, ipcRenderer, remote } = require('electron');
const NodeID3 = require('node-id3');
const Store = require('electron-store');
const store = new Store();

let idleTime = 0;
let selectedArtistIndex = 0;
let selectedSongIndex = 0;
let selectedArtist;
let selectedSong;

console.log('Starting: ', store.get('library'));

const artists = store.get('library');
let songs = artists[0].songs;

let index = 0;
artists.forEach(artist => {
    const image = (artist.image) ? artist.image.path : artist.path + 'picture.jpg';
    $('#list-artists').append(
        `<div class="card artist-card artist `+ (index===0 ? "active" : "")+`" id="artist-` +index+ `">
            <img src="`+ image + `" class="card-img-top artist-image">
            <div class="card-body artist-description">
              <h5 class="card-title">` + artist.name + `</h5>
            </div>
        </div>`
    );
    index++;
});

paintListSongs(0);

ipcRenderer.on('showRockola', (event) => {
    idleTime = 0;
});

setInterval(() => {
    idleTime++;
    if (idleTime >= 5) {
        ipcRenderer.send('showPlayer');
    }
}, 1000);

document.addEventListener('keydown', event => {
    const keyPressed = event.key;
    console.log(keyPressed);
    if (keyPressed === "a" || keyPressed === "d") selectArtist(keyPressed);
    if (keyPressed === "s" || keyPressed === "w") selectSong(keyPressed);

    if (keyPressed === "x") {
        selectedSong = songs[selectedSongIndex];
        ipcRenderer.send('playMusic', selectedSong);
    }
    idleTime = 0;
});

function paintListSongs(selectedArtistIndex) {
    const artist = artists[selectedArtistIndex];
    selectedSongIndex = 0;
    songs = artist.songs;
    let index = 0;
    console.log('Songs: ', songs);
    songs.forEach(song => {
        $('#list-songs').append(
            `<li class="list-group-item song `+(index===0 ? "active" : "")+`" id="song-`+ index +`">`+ song.name +`</li>`
        );
        index++;
    });
}

function selectArtist(keyPressed) {
    switch (keyPressed) {
        case "a":
            selectedArtistIndex = (selectedArtistIndex <= 0) ? artists.length - 1 : selectedArtistIndex - 1;
            break;
        case "d":
            selectedArtistIndex = (selectedArtistIndex >= artists.length - 1) ? 0 : selectedArtistIndex + 1;
            break;
    }
    const artist = artists[selectedArtistIndex];
    $(".artist").removeClass("active");
    $("#artist-" + selectedArtistIndex).addClass("active");
    keepSelectedArtistVisible();

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

function keepSelectedArtistVisible() {
    const activeItem = $("#list-artists .active");
    const listItems = $("#list-artists");
    const widthItem = $("#list-artists .active").outerWidth();

    if (activeItem.offset().left < listItems.offset().left) {
        listItems.scrollLeft((selectedArtistIndex === 0) ? 0 : (listItems.scrollLeft() - widthItem));
    }
    if ((activeItem.offset().left + activeItem.outerWidth()) > (listItems.offset().left + listItems.width())) {
        listItems.scrollLeft((selectedArtistIndex === artists.length - 1) ? Number.MAX_SAFE_INTEGER : (listItems.scrollLeft() + widthItem));
    }
}