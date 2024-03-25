
import React, { useEffect } from "react"

import { createClient } from "@connect2ic/core"
import { InternetIdentity } from "@connect2ic/core/providers"
import { Connect2ICProvider, ConnectDialog, useCanister, useConnect } from "@connect2ic/react"
import "@connect2ic/core/style.css"

import WithSubnavigation from "./components/WithSubnavigation"
import * as backend from "../src/declarations/backend"
import { router } from "./router/AppRouter";
import { Box, Center, ChakraProvider } from "@chakra-ui/react"
import { MdMargin } from "react-icons/md"


function App() {
    // const { isConnected, principal } = useConnect();

    // const [backend] = useCanister("backend");
    console.log("acà")


    return (
        <ChakraProvider>
            <h1>Hola mundo</h1>
            {/* <WithSubnavigation/> */}
        </ChakraProvider>







    )

}
declare let process: {
    env: {
        DFX_NETWORK: string
        NODE_ENV: string
    }
}
const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === "production" ? "ic" : "local");
const internetIdentityUrl = network === "local" ? "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai" : "https://identity.ic0.app"

const client = createClient({
    canisters: {
        backend,
    },
    providers: [
        new InternetIdentity({
            dev: true,
            providerUrl:
                internetIdentityUrl,
        }),
    ],
    globalProviderConfig: {
        // dev: import.meta.env.DEV,
        dev: true,
    },
})

export default () => (
    <Connect2ICProvider client={client}>
        <App />
    </Connect2ICProvider>
)