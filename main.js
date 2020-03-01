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

var pushButton = new Gpio(2, 'in', 'both');

pushButton.watch(function (err, value) {
    if (err) {
        console.error('There was an error', err);
        return;
    }
    console.log('Se presiono el pin 2');
});


function unexportOnClose() { //function to run when exiting program
    LED.writeSync(0); // Turn LED off
    LED.unexport(); // Unexport LED GPIO to free resources
    pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c

