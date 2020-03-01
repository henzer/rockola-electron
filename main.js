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

var b1 = new Gpio(2, 'in', 'falling', {debounceTimeout: 10});//3
var b2 = new Gpio(3, 'in', 'falling', {debounceTimeout: 10});//5
var b3 = new Gpio(4, 'in', 'falling', {debounceTimeout: 10});//7
// var b4 = new Gpio(14, 'in', 'rising', {debounceTimeout: 10});//8
var b5 = new Gpio(15, 'in', 'falling', {debounceTimeout: 10});//10
var b6 = new Gpio(17, 'in', 'falling', {debounceTimeout: 10});//11
var b7 = new Gpio(18, 'in', 'falling', {debounceTimeout: 10});//12
var b8 = new Gpio(27, 'in', 'falling', {debounceTimeout: 10});//13
var b9 = new Gpio(22, 'in', 'falling', {debounceTimeout: 10});//15

b1.watch((error, value) => console.log('Se presiono: ' + 1));
b2.watch((error, value) => console.log('Se presiono: ' + 2));
b3.watch((error, value) => console.log('Se presiono: ' + 3));

// b4.watch((error, value) => console.log('Se presiono: ' + 4));
b5.watch((error, value) => console.log('Se presiono: ' + 5));
b6.watch((error, value) => console.log('Se presiono: ' + 6));

b7.watch((error, value) => console.log('Se presiono: ' + 7));
b8.watch((error, value) => console.log('Se presiono: ' + 8));
b9.watch((error, value) => console.log('Se presiono: ' + 9));

console.log(b1.edge());
console.log(b2.edge());
console.log(b3.edge());
console.log(b4.edge());
console.log(b5.edge());
console.log(b6.edge());
console.log(b7.edge());
console.log(b8.edge());
console.log(b9.edge());
