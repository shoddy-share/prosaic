const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("prosaicStore", {
  get: (k) => ipcRenderer.invoke("store:get", k),
  set: (k, v) => ipcRenderer.invoke("store:set", k, v),
  remove: (k) => ipcRenderer.invoke("store:remove", k),
  clear: () => ipcRenderer.invoke("store:clear")
});
