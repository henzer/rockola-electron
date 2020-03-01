const { app, BrowserWindow, dialog, globalShortcut, ipcMain } = require('electron');
const { readMusic } = require('./files-reader');
const Store = require('electron-store');
const store = new Store();
const Gpio = require('onoff').Gpio;

let win;
let player;

const library = readMusic('music');
store.set('library', library);
store.set('playList', []);
console.log(store.get('library'));

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
        parent: win,
    });
    player.loadFile('player.html');
    // player.webContents.openDevTools();
});

ipcMain.on('playMusic', (event, song) => {
    player.webContents.send("addSong", song);
});

ipcMain.on('showPlayer', (event) => {
    if (!player.isVisible()) {
        player.show();
    }
});

ipcMain.on('showRockola', (event) => {
    player.hide();
    win.webContents.send('showRockola');
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});


var pin3 = new Gpio(2, 'in', 'rising', {debounceTimeout: 10});//3
var pin5 = new Gpio(3, 'in', 'rising', {debounceTimeout: 10});//5
var pin7 = new Gpio(4, 'in', 'rising', {debounceTimeout: 10});//7
var pin8 = new Gpio(14, 'in', 'rising', {debounceTimeout: 10});//8
var pin10 = new Gpio(15, 'in', 'rising', {debounceTimeout: 10});//10
var pin11 = new Gpio(17, 'in', 'rising', {debounceTimeout: 10});//11
var pin12 = new Gpio(18, 'in', 'rising', {debounceTimeout: 10});//12
var pin13 = new Gpio(27, 'in', 'rising', {debounceTimeout: 10});//13
var pin15 = new Gpio(22, 'in', 'rising', {debounceTimeout: 10});//15

pin3.watch((error, value) => console.log('Se presiono: ' + 3));
pin5.watch((error, value) => console.log('Se presiono: ' + 5));
pin7.watch((error, value) => console.log('Se presiono: ' + 7));

pin8.watch((error, value) => console.log('Se presiono: ' + 8));
pin10.watch((error, value) => console.log('Se presiono: ' + 10));
pin11.watch((error, value) => console.log('Se presiono: ' + 11));

pin12.watch((error, value) => console.log('Se presiono: ' + 12));
pin13.watch((error, value) => console.log('Se presiono: ' + 13));
pin15.watch((error, value) => console.log('Se presiono: ' + 15));
