const { contextBridge, ipcRenderer } = require("electron");

let myBridge = {
    StartConnection: async (data) => {
        return await ipcRenderer.invoke("StartConnection", data);
    },
    UpdateSettingsFile: async (data) => {
        return await ipcRenderer.invoke("UpdateSettingsFile", data);
    },
};
contextBridge.exposeInMainWorld("myBridge", myBridge);
