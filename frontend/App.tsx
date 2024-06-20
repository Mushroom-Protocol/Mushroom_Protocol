import React, { useEffect } from "react"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { InternetIdentity, PlugWallet, NFID } from "@connect2ic/core/providers"
import { Connect2ICProvider, useConnect } from "@connect2ic/react"
import "@connect2ic/core/style.css"
import { RouterProvider } from "react-router-dom"
// import * as backend from "../.dfx/local/canisters/backend"
import * as backend from "../src/declarations/backend/"
import { router } from "./router/AppRouter"
import { Text } from "@chakra-ui/react"

function App() {
  const { isConnected, principal, activeProvider  } = useConnect()

  return (
    <>
      <Text
        fontSize="16px"
        fontWeight="bold"
        backgroundColor={isConnected ? "#64B344" : "#EA332B"}
        color="#000000"
        p="8px"
        borderRadius="8px"
        m="20px"
        textAlign="center"
      >
        Hello
        {principal
          ? " " + principal
          : ", connect with Internet Identity to continue"}
        !
  
      </Text>
      <RouterProvider router={router} />
    </>
  )
}

declare let process: {
  env: {
    DFX_NETWORK: string
    NODE_ENV: string
  }
}

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === "production" ? "ic" : "local")
const internetIdentityUrl =
  network === "local"
    ? "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai"
    : "https://identity.ic0.app"

const client = createClient({
  canisters: {
    backend,
  },
  providers: [
    new InternetIdentity({
      dev: true,
      providerUrl: internetIdentityUrl,
    }),
    new PlugWallet(),
    new NFID(),
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
