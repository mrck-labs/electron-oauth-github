

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
    redirect_uri: 'http://localhost'
    state: '' // random string from 'defaultConfigForAuthorizationCode'
}

// 1. make Request and get authorization code
// 2. return authorization code
// 3. make request with authorization code, client id and secret, to get accessToken

// 4*. refresh token ??????
