const { app, BrowserWindow, dialog, globalShortcut } = require('electron');
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // and load the index.html of the app.
    win.loadFile('index.html');
}



let rightClickPosition = null



app.on('ready', () => {
    win = new BrowserWindow({ width: 800, height: 600, frame: false });
    win.loadFile('index.html');
    win.webContents.openDevTools();
    win.show()
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});