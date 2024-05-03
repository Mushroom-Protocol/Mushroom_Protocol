import React from "react"
import logo from "./assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect, useCanister } from "@connect2ic/react"
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity";
import "@connect2ic/core/style.css"
import { RouterProvider } from "react-router-dom";
import { router } from './router/AppRouter';


/*
 * Import canister definitions like this:
 */
// import * as backend from "../.dfx/local/canisters/backend"
/*
 * Some examples to get you started
 */

function App() {
  
  /*const estadoContext = useContext(EstadoContext);
  if (!estadoContext) {
    throw new Error('El componente debe estar dentro de un estadoContext');
  }
  
  const { estado, setEstado } = estadoContext;*/
  //const [estado, setEstado] = useState('');
  //  const [loading, setLoading] = useState(false);
  // @connect2ic
  const [backend] = useCanister("backend");
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Signed in
      // alert(principal);
    },
    onDisconnect: () => {
      // Signed out

    }
  });
  // @connect2ic


  /*<Alert status='info'>
      <AlertIcon />    
      <ConnectButton/>
      <ConnectDialog/>
      <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect your Internet Identity or Wallet to have a better experience in the MushRoom Protocol platform."}!</h1> 
      </Alert>  */


  return (
    <>
      {/* <EstadoProvider> */}
        <ConnectDialog dark={true} />
        <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
        <RouterProvider router={router} />
      {/* </EstadoProvider> */}
    </>
  )
};
declare let process : {
  env: {
    DFX_NETWORK: string
    NODE_ENV: string
  }
}
const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === "production" ? "ic" : "local");
const internetIdentityUrl = network === "local" ? "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai" : "https://identity.ic0.app"


const client = createClient({
  canisters: {
    // backend,
  },
  providers: [
    new InternetIdentity({
      dev: true,
      // The url for the providers frontend
      providerUrl: internetIdentityUrl,
    })
  ],
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
