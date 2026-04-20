const { contextBridge, ipcRenderer } = require("electron");

let myBridge = {
    StartConnection: async () => {
        return await ipcRenderer.invoke("StartConnection");
    },
    UpdateSettingsFile: async (data) => {
        return await ipcRenderer.invoke("UpdateSettingsFile", data);
    },
};
contextBridge.exposeInMainWorld("myBridge", myBridge);
