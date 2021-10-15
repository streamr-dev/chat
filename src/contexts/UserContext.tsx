/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react"
import StreamrClient from "streamr-client"

export const UserContext = createContext({
    connectedAddress: "",
    publicAddress: "",
    client: {} as StreamrClient,
    setConnectedAddress: (val: string) => {},
    setPublicAddress: (val: string) => {},
    setClient: (val: StreamrClient) => {},
})
