import { Injectable } from '@angular/core';

@Injectable()
export class AuthServices {
  private webClientId = '';
  constructor() {
    console.log('AuthServices Provider initiated');
  }

  /*
  **fbLogin is the public method for facebook login
  **parameters: nil
  **return: a Promise - resolves to an object of type UserInfo. rejects the error returned from the facebook plugin
  */
  fbLogin() : Promise<any> {
    console.log('fb login called');
    return new Promise((resolve, reject) => fbLogin(resolve, reject));
  }

  /*
  **fbLogout is the public method for facebook logout
  **parameters: nil
  **return: a Promise - resolves to the string 'logout successful'. rejects the string 'logout failed'
  */
  fbLogout() : Promise<any> {
    console.log('fb logout called');
    return new Promise(fbLogout);
    function fbLogout(resolve, reject) {
      facebookConnectPlugin.logout(() => resolve('logout successful'), () => reject('logout failed'));
    }
  }

  /*
  **call googleRegister before using the googleLogin
  **parameters: 1
  **    webClientId: required. string.
  */
  googleRegister(webClientId: string) {
    if(!webClientId) {
      return false;
    }
    this.webClientId = webClientId;
    return true;
  }

  /*
  **googleLogin is the public method for google login
  **parameters: 1
  **returns: a Promise - resolves to an object of type UserInfo. rejects the error returned from the googleplus plugin
  */
  googleLogin() : Promise<any> {
    console.log('google login called');
    return new Promise((resolve, reject) => googleLogin(resolve, reject, this.webClientId));
  }

  /*
  **googleLogout is the public method for google logout
  **parameters:
  **returns: a Promise - resolves to the string 'logout successful'. rejects the string 'logout failed'
  */
  googleLogout() {
    console.log('google logout called');
    return new Promise(googleLogout);
    function googleLogout(resolve, reject) {
       (window as any).plugins.googleplus.logout(() => resolve('logout successful'), () => reject('logout failed'));
    }
  }
}

/**
**support function which calls the facebookConnectPlugin methods to
**perform the facebook login.
**refer https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/README.md for plugin information
**params: 2
**  resolve: promise resolve function. required.
**  reject: promise reject function. required.
**return: void
**uses the following internal functions
**  1. getFbDetail
**  2. fbLoginSuccess
**  3. fbLoginFail
**/
function fbLogin(resolve, reject) {
  facebookConnectPlugin.getLoginStatus(checkAlreadyLoggedIn, function(error){console.log("call failed " + error); reject(error);});
  function checkAlreadyLoggedIn(response) {
    if (response.status == "connected") {
      console.log("already connected");
      //console.log(response);
      //user already signed in to facebook.
      getFbDetail(response);
      //facebookConnectPlugin.logout(function(){console.log("successfully logged out");}, function(){console.log("error in loggin out");});
    }
    else {
      facebookConnectPlugin.login(["email", "public_profile"], fbLoginSuccess, fbLoginFail);
    }
  }

  function fbLoginSuccess(response) {
    console.log("Login Success");
    console.log(response);
    getFbDetail(response);
  }
  function fbLoginFail(error) {
    console.log("login failed");
    console.log(error);
    reject(error);
  }
  function getFbDetail(response) {
    facebookConnectPlugin.api(response.authResponse.userID + "/?fields=id,first_name, last_name, picture, email&acess_token=" + response.authResponse.accessToken, [],
        function (result) {
          result.access_token = response.authResponse.accessToken;
          result.facebook = true;
          console.log("Result: " + JSON.stringify(result));
          let userInfo = new UserInfo(result);
          resolve(userInfo);
        },
        fbLoginFail
     );
  }
}

/**
**support function which calls the googleplus Plugin methods to
**perform the google login.
**refer https://github.com/EddyVerbruggen/cordova-plugin-googleplus for plugin information
**params: 3
**  resolve: promise resolve function. required.
**  reject: promise reject function. required.
**  webClientId: webClientId. string. required.
**return: void
**uses the following internal functions
**  1. googlePlusLoginSuccess
**  2. googlePlusLoginFailure
**/
function googleLogin(resolve, reject, webClientId) {

  const googleLoginContext =   {
    'scopes': 'profile email',
    'webClientId': webClientId,
    'offline': true
  };
  if(!webClientId) {
    googleLoginContext.offline = false;
  }

  (window as any).plugins.googleplus.login(
          googleLoginContext,
          googlePlusLoginSuccess,
          googlePlusLoginFailure
  );
  function googlePlusLoginSuccess(data) {
    console.log("explicit login through google successful", data);
    let userInfo = new UserInfo(data);
    resolve(userInfo);
  }
  function googlePlusLoginFailure(error) {
      console.log("explicit login through google failed", error);
      reject(error);
  }
}

/*
**The class definition for the information returned from facebook login
**and google login
*/
export class UserInfo {
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
  constructor(result) {
      if(result.facebook) {
        this.first_name = result.first_name;
        this.last_name = result.last_name;
        this.email = result.email;
        this.pictureUrl = result.picture.data.url;
        this.facebook = {
          id : result.id,
          access_token : result.access_token
        };

      }
      else {
        this.first_name = result.givenName;
        this.last_name = result.familyName;
        this.email = result.email;
        this.pictureUrl = result.imageUrl;
        this.google = {
          displayName : result.displayName,
          idToken : result.idToken,
          serverAuthCode : result.serverAuthCode,
          userId : result.userId,
        }
      }
  }
}
