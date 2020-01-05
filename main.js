const { app, BrowserWindow, dialog, globalShortcut, ipcMain } = require('electron');

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
};

function showDialog(keyPressed) {
  dialog.showMessageBox({
    type: 'info',
    message: 'Success!',
    detail: 'You pressed: '+ keyPressed,
    buttons: ['OK']
  });
}





let rightClickPosition = null



app.on('ready', () => {
    win = new BrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });
    win.loadFile('index.html');
    win.webContents.openDevTools();
    win.show()

    globalShortcut.register('A', () => {
      win.webContents.send('keyEvent', 'A');
    });
    globalShortcut.register('S', () => {
      win.webContents.send('keyEvent', 'S');
    });
    globalShortcut.register('D', () => {
      win.webContents.send('keyEvent', 'D');
    });
    globalShortcut.register('W', () => {
      win.webContents.send('keyEvent', 'W');
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});