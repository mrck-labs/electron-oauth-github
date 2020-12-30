# Electron OAuth Github package.

## How to use it ?
This package, helps with OAuth authorization from Github. It uses `web application flow` described here: https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#web-application-flow

Package is exposing 2 functions:
```
module.exports = {
    getAuthorizationCode,
    getAccessToken
}
```

To obtain Access Token, (which is the reason of this package), you need to use only `getAccessToken`
function. This function uses `getAuthorizationCode` underneath. When you obtain access token, you can than make request to Github Rest API with it.

```
npm install @electron-utils/electron-oauth-github
```

```
yarn add @electron-utils/electron-oauth-github
```

```
const {getAccessToken} = require('@electron-utils/electron-oauth-github')

try {
    const {access_token} = await getAccessToken({
      clientId: "your github app client id",
      clientSecret: "your github  app client secret",
      redirectUri: "your rediretion uri",
      scope: "scope of permissions you want to give"
    })

    mainWindow.webContents.send('accessToken', access_token) // here, we just send access token to frontend part of electron app (to mainWindow)
  } catch (error) {
    console.log("error happened")
    console.log(error)
  }
```


## Development
```
git clone git@github.com:marckraw/electron-oauth-github.git
```

```
yarn link 
```
To use dev version, with you Electron application.

## Build and deploy
There is no, build / bundling process for it, for now. When merged to master via PR, github action is fired, which 
deploy package to npm global registry.

## Is it production ready?
You should consider this as a testing/preview package. I needed this for my personal projects, so i've built it and publish it :)
If there will be enough interest in it, we can try to make it fully legit. Feel free to create issues, and also pull request.



