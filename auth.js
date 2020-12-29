const {createOAuthWindow} = require('./windowsManager')

const githubBaseAuthorizeUrl = 'https://github.com/login/oauth/authorize' // GET request
const defaultConfigForAuthorizationCode = {
    client_id: '',
    redirect_uri: 'http://localhost',
    scope: '',
    state: '', // generate some random string (https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#web-application-flow)
}




const githubBaseAccessTokenUrl = 'https://github.com/login/oauth/access_token' // POST request
const defaultConfigForAccessToken = {
    client_id: '',
    client_secret: '',
    code: '',
    redirect_uri: 'http://localhost',
    state: '' // random string from 'defaultConfigForAuthorizationCode'
}

// 1. make Request and get authorization code
// 2. return authorization code
// 3. make request with authorization code, client id and secret, to get accessToken

// 4*. refresh token ??????


const testFunction = () => {
    console.log("i'm invoked from taks managment !")
    console.log("ok, this is now live dev version")
    return "Hello World"
}

const getAuthorizationCode = async ({clientId, redirectUri, scope}) => {
    let response = null
    let error = null
    const randomState = 'asdfghjkl'
    const authorizationCodeRequestGithubUrl =  `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${randomState}`

    return new Promise((resolve, reject) => {
        const OAuthWindow = createOAuthWindow()
        OAuthWindow.loadURL(authorizationCodeRequestGithubUrl)

        OAuthWindow.once('ready-to-show', () => {
            console.log("ready-to-show event")
            OAuthWindow.show()
        })

        OAuthWindow.webContents.on("did-fail-load", (data) => {
            console.log("load failed ?")
        })

        OAuthWindow.webContents.on("dom-ready", (data) => {
            console.log("DOM is ready!")
        })

        OAuthWindow.webContents.on("will-navigate", (event, url) => {
            // will navigate happens when someone dont have access and didnt grant permission
            console.log("will navigate, url: ", url)
            if(url.includes(redirectUri)) {
                // here i should implement error handling ?
                console.log("this is will-navigate! ", url)
                const deconstructUrl = new URL(url)

                if(deconstructUrl.searchParams.get('error')) {
                    console.log(deconstructUrl.searchParams)
                    error = {
                        message: deconstructUrl.searchParams.get('error'),
                    }
                    reject(error)
                } else {
                    const code = deconstructUrl.searchParams.get('code')
                    const state = deconstructUrl.searchParams.get('state')

                    response = {code, state}
                    resolve(response)
                }

                OAuthWindow.close()
            }
        })

        OAuthWindow.webContents.on("will-redirect", (event, url) => {
            console.log("will redirect, url: ", url)
            if(url.includes(redirectUri)) {
                // Will redirect works when someone already has access and got permission
                console.log("this is will-redirect! ", url)

                const deconstructUrl = new URL(url)
                const code = deconstructUrl.searchParams.get('code')
                const state = deconstructUrl.searchParams.get('state')

                response = {code, state}
                resolve(response)
                OAuthWindow.close()
            }
        })

        OAuthWindow.webContents.on("did-navigate", (event, url, httpResponseCode, httpStatusText) => {
            console.log("####################")
            console.log("did navigate ?")
            console.log("url: ", url)
            console.log("http response code: ")
            console.log(httpResponseCode)
            console.log(httpStatusText)
            console.log("####################")
        })
    })
}

const getAccessToken = () => {
    console.log("getting access token... (to implement)")
}

module.exports = {
    testFunction,
    getAuthorizationCode,
    getAccessToken
}
