console.log('Hola');
const { app, BrowserWindow, dialog, globalShortcut, ipcRenderer } = require('electron');
const { readMusic, convertSong } = require('./files-reader');

let selectedArtistIndex = 0;
let selectedSongIndex = 0;
let selectedArtist;
let selectedSong;

const artists = readMusic('music');
let songs = artists[0].songs;

let index = 0;
artists.forEach(artist => {
    $('#list-artists').append(
        `<div class="card artist-card artist `+ (index===0 ? "selected" : "")+`" id="artist-` +index+ `">
            <div class="card-img-top artist-image">
            </div>
            <div class="card-body artist-description">
              <h5 class="card-title">` + artist.name + `</h5>
            </div>
        </div>`
    );
    index++;
});

paintListSongs(0);

ipcRenderer.on('keyEvent', (event, keyPressed) => {
    selectArtist(keyPressed);
    selectSong(keyPressed);

    if (keyPressed === 'X') {
        selectedSong = songs[selectedSongIndex];
        selectedArtist = artists[selectedArtistIndex];
        const path = selectedArtist.path + selectedSong;
        console.log(path);
        const player = $("#audio-player")[0];
        $("#audio-source").attr("src", path);
        player.pause();
        player.load();
        player.oncanplaythrough = player.play();
    }
});

function paintListSongs(selectedArtistIndex) {
    const artist = artists[selectedArtistIndex];
    songs = artist.songs;
    let index = 0;
    songs.forEach(song => {
        $('#list-songs').append(
            `<li class="list-group-item song `+(index===0 ? "active" : "")+`" id="song-`+ index +`">`+ song +`</li>`
        );
        index++;
    });
}

function selectArtist(keyPressed) {
    switch (keyPressed) {
        case 'A':
            selectedArtistIndex = (selectedArtistIndex <= 0) ? artists.length - 1 : selectedArtistIndex - 1;
            break;
        case 'D':
            selectedArtistIndex = (selectedArtistIndex >= artists.length - 1) ? 0 : selectedArtistIndex + 1;
            break;
    }
    const artist = artists[selectedArtistIndex];
    $(".artist").removeClass("selected");
    $("#artist-" + selectedArtistIndex).addClass("selected");

    $("#list-songs").empty();
    paintListSongs(selectedArtistIndex);
}

function selectSong(keyPressed) {
    switch (keyPressed) {
        case 'W':
            selectedSongIndex = (selectedSongIndex <= 0) ? songs.length - 1 : selectedSongIndex - 1;
            break;
        case 'S':
            selectedSongIndex = (selectedSongIndex >= songs.length - 1) ? 0 : selectedSongIndex + 1;
            break;
    }
    $(".song").removeClass("active");
    $("#song-" + selectedSongIndex).addClass("active");
}