import OpenLogin from "openlogin";
import { useEffect, useState } from "react";
import * as bs58 from "bs58";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";

const YOUR_PROJECT_ID = "BOUSb58ft1liq2tSVGafkYohnNPgnl__vAlYSk3JnpfW281kApYsw30BG1-nGpmy8wK-gT3dHw2D_xRXpTEdDBE";
function App() {
  const [loading, setLoading] = useState(false);
  const [openLogin, setOpenLogin] = useState<OpenLogin | null>(null);

  useEffect(() => {
    setLoading(true);
    async function initializeOpenLogin() {
      const openLoginInstance = new OpenLogin({
        // your clientId aka projectId , get it from https://developer.tor.us
        // clientId is not required for localhost, you can set it to any string
        // for development
        clientId: YOUR_PROJECT_ID,
        network: "testnet",
      });
      await openLoginInstance.init();
      setOpenLogin(openLoginInstance);
      if (openLoginInstance.privKey) {
        await printUserInfo();
      }
      setLoading(false);
    }
    initializeOpenLogin();
  }, []);

  const printToConsole = (...args: unknown[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };
  async function login() {
    if (!openLogin) return;
    setLoading(true);
    try {
      const privKey = await openLogin.login({
        // pass empty string '' as loginProvider to open default torus modal
        // with all default supported login providers or you can pass specific
        // login provider from available list to set as default.
        // for ex: google, facebook, twitter etc
        loginProvider: "",
        redirectUrl: `${window.origin}`,
        // you can pass standard oauth parameter in extralogin options
        // for ex: in case of passwordless login, you have to pass user's email as login_hint
        // and your app domain.
        // extraLoginOptions: {
        //   domain: 'www.yourapp.com',
        //   login_hint: 'hello@yourapp.com',
        // },
      });
      if (privKey && typeof privKey === "string") {
        await printUserInfo();
      }

      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  const printUserInfo = async () => {
    if (!openLogin) return;
    const userInfo = await openLogin.getUserInfo();
    printToConsole(userInfo);
  };

  const getEd25519Key = async () => {
    if (!openLogin) return;
    const { sk } = getED25519Key(openLogin.privKey);
    const base58Key = bs58.encode(sk);
    printToConsole(base58Key);
  };

  const logout = async () => {
    if (!openLogin) return;
    setLoading(true);
    await openLogin.logout({});
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <h1>....loading</h1>
          </div>
        </div>
      ) : (
        <div className="App">
          {!openLogin?.privKey ? (
            <div>
              <h3>Login With Openlogin</h3>
              <button onClick={login}>login</button>
            </div>
          ) : (
            <div>
              <section>
                <div>
                  Private key:
                  <i>{openLogin.privKey}</i>
                  <button onClick={() => logout()}>Logout</button>
                </div>
                <div>
                  <button onClick={printUserInfo}>Get User Info</button>
                  <button onClick={getEd25519Key}>Get Ed25519Key </button>

                  <div id="console" style={{ whiteSpace: "pre-line" }}>
                    <p style={{ whiteSpace: "pre-line" }} />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
