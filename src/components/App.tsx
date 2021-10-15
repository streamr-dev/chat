import React, { useState, useEffect } from "react"
import StreamrClient from "streamr-client"
import { ethers } from "ethers"
import { BrowserRouter as Router } from "react-router-dom"

import Messages from "./Messages/Messages"
import Chat from "./Chat/Chat"
import Header from "./Header/Header"
import "./App.css"
import { UserContext } from "../contexts/UserContext"
import { Box } from "@chakra-ui/react"

declare global {
  interface Window {
    ethereum: any;
  }
}

const App = (): any => {
    const [connectedAddress, setConnectedAddress] = useState("")
    const [publicAddress, setPublicAddress] = useState("")
    const [client, setClient] = useState<StreamrClient | null>()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    return (
        <Router>
            <Box height="100vh" width="100vw" paddingY="8">
                <UserContext.Provider
                    value={{
                        connectedAddress,
                        publicAddress,
                        client,
                        setPublicAddress,
                        setConnectedAddress,
                        setClient,
                    }}
                >
                    <Header setProvider={setProvider} />
                    <Chat />
                    <Messages />
                </UserContext.Provider>
            </Box>
        </Router>
    )
}

export default App
