


import React, { useEffect } from "react"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { Actor, HttpAgent } from '@dfinity/agent';
import { createClient } from "@connect2ic/core"
import { InternetIdentity } from "@connect2ic/core/providers"
import { Connect2ICProvider, ConnectDialog, useCanister, useConnect } from "@connect2ic/react"
import "@connect2ic/core/style.css"

import { BrowserRouter as Router, Routes, Route, Navigate, RouterProvider } from "react-router-dom"

// import * as backend from "../.dfx/local/canisters/backend"
import * as backend from "../src/declarations/backend"
import { router } from "./router/AppRouter";
import { EstadoProvider } from "./components/utils/estadoContex";
import StartupForms from "./components/Apply/StartupForms";


function App() {
    const { isConnected, principal } = useConnect();

    const [backend] = useCanister("backend");
    

    // const rightToVote = async () => {
    //     let isDao = await backend.isDaoDeployed();
    //     console.log("Dao deployed? ", isDao);
    //     if (isDao) {
    //         /*let daoPrincipal = String(await backend.getPrincipalDao());
    //         console.log("Dao Principal: ", daoPrincipal) //OK

    //         const agent = new HttpAgent({});
    //         const dao = Actor.createActor(Dao.idlFactory, { agent, canisterId: daoPrincipal });

    //         console.log(await dao.getName()); // OK
    //         console.log(await dao.whoAmi()); // Error: Fail to verify certificate
    //         let member = await dao.isAMember(principal);
    //         return member;
    //         */
    //         //----- Modificar al solucionar Front -> DAO ------
    //         let isMember = await backend.userIsDaoMember();
    //         console.log("Is Dao member? ", isMember);
    //         return isMember ? true : false;

    //     }
    //     else {
    //         let isAdmin = await backend.iamAdmin();
    //         console.log("Is admin? ", isAdmin);
    //         return isAdmin ? true : false;
    //     };
    // };

    // let userDaoMember = false;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (isConnected) {
    //             userDaoMember = await rightToVote();
    //         }
    //     };
    //     fetchData();
    // }, [isConnected, principal]);

    return (
        // <>
        //     <EstadoProvider>
        //         <ConnectDialog dark={true} />
        //         <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
        //         <RouterProvider router={router} />
        //     </EstadoProvider>
        // </>
        <>
        <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
        <RouterProvider router={router} />
        <Router>
            {/* <Routes>
                <Route path="./components/Apply/StartupForms" element={<StartupForms/>} />
            </Routes> */}
            
        </Router>
        </>

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