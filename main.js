const {app, BrowserWindow, ipcMain, shell, Menu} = require("electron");
const path = require("node:path");
const {DatabaseSync} = require("node:sqlite");

let db = null;

function openDatabase() {
  const file = path.join(app.getPath("userData"), "prosaic.db");
  const database = new DatabaseSync(file);
  database.exec("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  database.exec("PRAGMA journal_mode=WAL");
  return database;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: "Prosaic",
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, "app", "prosaic.html"));
  win.webContents.on("context-menu", () => {
    Menu.buildFromTemplate([
      {role: "cut"},
      {role: "copy"},
      {role: "paste"},
      {type: "separator"},
      {role: "selectAll"}
    ]).popup({window: win});
  });
  win.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: "deny"};
  });
}

app.whenReady().then(() => {
  try {
    db = openDatabase();
    const stmtGet = db.prepare("SELECT v FROM kv WHERE k = ?");
    const stmtSet = db.prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v");
    const stmtDel = db.prepare("DELETE FROM kv WHERE k = ?");
    ipcMain.handle("store:get", (_, k) => {
      const row = stmtGet.get(String(k));
      return row ? row.v : null;
    });
    ipcMain.handle("store:set", (_, k, v) => { stmtSet.run(String(k), String(v)); });
    ipcMain.handle("store:remove", (_, k) => { stmtDel.run(String(k)); });
    ipcMain.handle("store:clear", () => { db.exec("DELETE FROM kv"); });
  } catch (err) {
    console.error("Prosaic: SQLite unavailable, app will fall back to browser storage.", err);
  }

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
