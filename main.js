const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { start, stop } = require("./obs-set");

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
        join;
    });
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});

ipcMain.handle("StartConnection", async (event, settings) => {
    console.log("Connection would like to start!");
    console.log("found settings: ", settings);
    await start(settings);
});
ipcMain.handle("StopConnection", () => {
    stop();
});
