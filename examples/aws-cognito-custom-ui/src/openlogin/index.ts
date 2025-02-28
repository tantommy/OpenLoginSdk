import OpenLogin from "openlogin";

const YOUR_PROJECT_ID = "BOUSb58ft1liq2tSVGafkYohnNPgnl__vAlYSk3JnpfW281kApYsw30BG1-nGpmy8wK-gT3dHw2D_xRXpTEdDBE";

const openlogin = new OpenLogin({
  // your clientId aka projectId , get it from https://developer.tor.us
  // clientId is not required for localhost, you can set it to any string
  // for development
  clientId: YOUR_PROJECT_ID,
  network: "testnet",
  loginConfig: {
    jwt: {
      name: "Custom Cognito Openlogin",
      verifier: process.env.REACT_APP_VERIFIER || "demo-cognito-custom-example",
      /**
       * The type of login. Refer to enum `LOGIN_TYPE`
       */
      typeOfLogin: "jwt",
      clientId: YOUR_PROJECT_ID,
    },
  },
});

export const loginWithOpenlogin = async (idToken: string) => {
  const privKey = await openlogin.login({
    // pass empty string '' as loginProvider to open default torus modal
    // with all default supported login providers or you can pass specific
    // login provider from available list to set as default.
    // for ex: google, facebook, twitter etc
    loginProvider: "jwt",
    redirectUrl: `${window.location.origin}/home`,

    // you can pass standard oauth parameter in extralogin options
    // for ex: in case of passwordless login, you have to pass user's email as login_hint
    // and your app domain.
    // extraLoginOptions: {
    //   domain: 'www.yourapp.com',
    //   login_hint: 'hello@yourapp.com',
    // },
    extraLoginOptions: {
      domain: "http://localhost:3000",
      verifierIdField: "sub",
      id_token: idToken,
    },
  });
  return privKey;
};

export default openlogin;
