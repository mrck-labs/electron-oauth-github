const {BrowserWindow} = require("electron")

const createOAuthWindow = () => {
    return new BrowserWindow({
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

module.exports = {
    createOAuthWindow
}
