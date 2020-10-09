const { app, BrowserWindow, dialog, globalShortcut, ipcMain } = require('electron');
const { readMusic } = require('./files-reader');
const Store = require('electron-store');
const store = new Store();
const SCAN_MUSIC = process.env.SCAN_MUSIC;
const URL_MUSIC = process.env.URL_MUSIC;
// const Gpio = require('onoff').Gpio;

console.log(SCAN_MUSIC);

let win;
let player;

const urlMusic = URL_MUSIC ? URL_MUSIC : 'music';
var library;
if (SCAN_MUSIC || !store.get('library')) {
    console.log('Cargando musica');
    library = readMusic(urlMusic);
    store.set('library', library);
} else {
    console.log('Leyendo de memoria');
    library = store.get('library');
}
store.set('playList', []);

app.on('ready', () => {
    win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
    // win.webContents.openDevTools();
    win.show()
    player = new BrowserWindow({
        fullscreen: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
    });
    player.loadFile('player.html');
    player.hide();
    // player.webContents.openDevTools();
});

ipcMain.on('playMusic', (event, song) => {
    player.webContents.send("addSong", song);
});

ipcMain.on('showPlayer', (event) => {
    console.log('Show player');
    if (!player.isVisible()) {
        player.show();
    }
});

ipcMain.on('showRockola', (event) => {
    console.log('Show Rockola');
    win.webContents.send("showRockola");
    player.hide();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});


// var pin3 = new Gpio(2, 'in', 'rising', {debounceTimeout: 100});//3
// var pin5 = new Gpio(3, 'in', 'rising', {debounceTimeout: 100});//5
// var pin7 = new Gpio(4, 'in', 'rising', {debounceTimeout: 100});//7
// var pin8 = new Gpio(14, 'in', 'rising', {debounceTimeout: 100});//8
// var pin10 = new Gpio(15, 'in', 'rising', {debounceTimeout: 100});//10
// var pin11 = new Gpio(17, 'in', 'rising', {debounceTimeout: 100});//11
// var pin12 = new Gpio(18, 'in', 'rising', {debounceTimeout: 100});//12
// var pin13 = new Gpio(27, 'in', 'rising', {debounceTimeout: 100});//13
// var pin15 = new Gpio(22, 'in', 'rising', {debounceTimeout: 100});//15

// pin3.watch((error, value) => console.log('Se presiono: ' + 3));
// pin5.watch((error, value) => console.log('Se presiono: ' + 5));
// pin7.watch((error, value) => console.log('Se presiono: ' + 7));

// pin8.watch((error, value) => console.log('Se presiono: ' + 8));
// pin10.watch((error, value) => console.log('Se presiono: ' + 10));
// pin11.watch((error, value) => console.log('Se presiono: ' + 11));

// pin12.watch((error, value) => console.log('Se presiono: ' + 12));
// pin13.watch((error, value) => console.log('Se presiono: ' + 13));
// pin15.watch((error, value) => console.log('Se presiono: ' + 15));
