require('isomorphic-fetch')
const {createOAuthWindow} = require('./windowsManager')

const getAuthorizationCode = async ({clientId, redirectUri, scope}) => {
    const randomState = 'asdfghjkl' // TODO: make it really random....
    const authorizationCodeRequestGithubUrl =  `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${randomState}`

    return new Promise((resolve, reject) => {
        const OAuthWindow = createOAuthWindow()
        OAuthWindow.loadURL(authorizationCodeRequestGithubUrl)

        OAuthWindow.once('ready-to-show', () => {
            OAuthWindow.show()
        })

        OAuthWindow.webContents.on("will-navigate", (event, url) => {
            // will navigate happens when someone dont have access and didnt grant permission
            if(url.includes(redirectUri)) {
                // here i should implement error handling ?
                const deconstructUrl = new URL(url)

                if(deconstructUrl.searchParams.get('error')) {
                    reject({
                        message: deconstructUrl.searchParams.get('error'),
                    })
                } else {
                    const code = deconstructUrl.searchParams.get('code')
                    const state = deconstructUrl.searchParams.get('state')

                    resolve({code, state})
                }

                OAuthWindow.close()
            }
        })

        OAuthWindow.webContents.on("will-redirect", (event, url) => {
            if(url.includes(redirectUri)) {
                // Will redirect works when someone already has access and got permission
                const deconstructUrl = new URL(url)
                const code = deconstructUrl.searchParams.get('code')
                const state = deconstructUrl.searchParams.get('state')

                resolve({code, state})
                OAuthWindow.close()
            }
        })
    })
}

const getAccessToken = async ({clientId, redirectUri, scope, clientSecret}) => {
    try {
        const {code, state} = await getAuthorizationCode({clientId, redirectUri, scope})

        return fetch('https://github.com/login/oauth/access_token', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code,
                state
            })
        })
            .then(response => response.json())
            .catch(error => {
                console.log("error happened....")
                console.log(error)
                return error
            })
    } catch (error) {
        console.log("error happened")
        console.log(error)
        return error
    }
}

module.exports = {
    getAuthorizationCode,
    getAccessToken
}
