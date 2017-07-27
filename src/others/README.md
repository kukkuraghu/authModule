# angular-social-auth-module

> An angular module which provides social(facebook and google) authentication services for ionic and cordova hybrid mobile applications

## Installation
```bash
npm install angular-social-auth --save
```
See npm package for versions - https://www.npmjs.com/package/angular-socialAuth

### Installing the cordova plugins

#### Cordova facebook plugin
Make sure you've registered your  app with Facebook and have an `APP_ID` [https://developers.facebook.com/apps](https://developers.facebook.com/apps).

For cordova apps
```bash
$ cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="123456789" --variable APP_NAME="myApplication"
```
For ionic apps
```bash
$ ionic cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="123456789" --variable APP_NAME="myApplication"
```
If you need to change your `APP_ID` after installation, it's recommended that you remove and then re-add the plugin as above. Note that changes to the `APP_ID` value in your `config.xml` file will *not* be propagated to the individual platform builds.  

Refer [Cordova facebook plugin help page](https://github.com/jeduan/cordova-plugin-facebook4/blob/master/README.md) for guidance.  
android issues :
There are some issues with the facebook framework included in the plugin cordova-plugin-facebook4 in android installation.
To avoid these issues, make sure the latest version of 'Android Support Library' and 'Android Support Repository' are installed 
using Android SDK Manager.
It seems there are some issues with the Android facebook SDK version 4.24.0. The plugin.xml is written in a way to pick 
the latest sdk. To change this, edit the framework tag in plugin.xml (under plugins/cordova-plugin-facebook4) to  
`<framework src="com.facebook.android:facebook-android-sdk:4.23.+"/>`

#### Cordova googleplus plugin
```bash
cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=myreversedclientid
```
For ionic apps
```bash
ionic cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=myreversedclientid
```
refer https://github.com/EddyVerbruggen/cordova-plugin-googleplus for detail

## Usage
Import the SocialAuthModule in the main module (usually named app.module.ts).  
	`import { SocialAuthModule } from 'angular-social-auth';`  
For the @NgModule decorator input object, SocialAuthModule should be mentioned in the imports array  
If AuthServices to be used in a component, import it before using it.  
	`import { AuthServices } from 'angular-social-auth';`

## API
Before calling any of the methods, please ensure that cordova deviceready event is fired (in ionic Platform.ready() is fulfilled).  
The login methods(both fbLogin and googleLogin) return a promise, that will resolve to an object of type UserInfo.  
The structure of UserInfo is  
```
class UserInfo {
  readonly first_name: string;  
  readonly last_name: string;
  readonly email: string;
  readonly pictureUrl: string;
  readonly facebook: {
    readonly id: string;
    readonly access_token: string;
  }
  readonly google: {
    readonly displayName: string;
    readonly idToken: string;
    readonly serverAuthCode: string;
    readonly userId:string;
  }
}
```
### fbLogin
`authServices.fbLogin()`  
fbLogin is the public method for facebook login  
parameters: none  
return: a Promise - resolves to an object of type UserInfo. rejects the error returned from the facebook plugin



### fbLogout
`authServices.fbLogout()`  
fbLogout is the public method for facebook logout  
parameters: nil  
return: a Promise - resolves to the string 'logout successful'. rejects the string 'logout failed'

### googleRegister(webClientId)
`authServices.googleRegister(webClientId)`  
call googleRegister to register a webClientId for google app.  
for android, a webClientId is required to get the idToken  and serverAuthCode from google.  
for ios, a webClientId is required to get the serverAuthCode from google. idToken will be provided without webClientId.  
parameters: 1  (webClientId: required. string).

### googleLogin
`authServices.googleLogin()`  
googleLogin is the public method for google login  
If no webClientId is registered,  
 - Android apps won't be getting the idToken  and serverAuthCode from google 
 - ios apps won't get the serverAuthCode (google will provide the idToken without webClientId)

parameters: None  
returns: a Promise - resolves to an object of type UserInfo. rejects the error returned from the googleplus plugin.

### googleLogout
`authServices.googleLogout()`  
googleLogout is the public method for google logout  
parameters:None  
returns: a Promise - resolves to the string 'logout successful'. rejects the string 'logout failed'
	
## Changelog  
**1.1.1**  

----------
 1. UserInfo class is available for import.  
    Users can import UserInfo as following.  
    `import { UserInfo } from 'angular-social-auth';`   
    Both fbLogin and googleLogin (upon successful login) return an object of type  
    UserInfo.  
    The structure of the UserInfo is  
    ```
	class UserInfo {
      readonly first_name: string;  
      readonly last_name: string;
      readonly email: string;
      readonly pictureUrl: string;
      readonly facebook: {
        readonly id: string;
        readonly access_token: string;
      }
      readonly google: {
        readonly displayName: string;
        readonly idToken: string;
        readonly serverAuthCode: string;
        readonly userId:string;
      }
    }
	```
**1.1.0**  

----------
 1. No need to register webClientId, before calling googleLogin. But if
    webClientId is not registered, google won't return the tokenId and
    serverAuthCode for android. For iOS, serverAuthCode won't be
    returned (google will provide idToken without webClientId for iOS).

