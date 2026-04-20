const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
    console.log("Preload path:", path.resolve(__dirname, "preload.js"));
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.js"),
        },
    });
    win.loadFile("index.html");
};
app.whenReady().then(() => {
    // Initializing Electron
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});

ipcMain.handle("StartConnection", () => {
    console.log("Connection would like to start!");
});

ipcMain.handle("UpdateSettingsFile", (event, data) => {
    console.log("Recieved settings: ", data);
});
