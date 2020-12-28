const {BrowserWindow, app, ipcMain} = require("electron")


let OAuthWindow;

const createOAuthWindow = () => {
    OAuthWindow = new BrowserWindow({
        width: 500,
        height: 800,
        center: true,
        resizable: false,
        title: "Github OAuth",
        webPreferences: {
            contextIsolation: true,
            devTools: true,
        }
    })
}

app.whenReady().then(() => {
    createOAuthWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', () => {
    console.log("before quit hook")
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createOAuthWindow()
    }
})
