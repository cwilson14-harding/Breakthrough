const { app, BrowserWindow } = require('electron');
let win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1360,
    height: 768,
    fullscreen: true, // Set to false to make a window.
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/favicon.ico`
  });
  win.loadURL(`file://${__dirname}/dist/index.html`);
  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()
  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  });
  win.setMenu(null); // Comment this to show the toolbar (for development).
}
// Create window on electron intialization
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});
