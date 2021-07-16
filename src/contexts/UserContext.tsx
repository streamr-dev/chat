import { createContext } from "react";
import StreamrClient from "streamr-client";

interface ContextType {
  connectedAddress: string;
  publicAddress: string;
  client: StreamrClient;
  setConnectedAddress: (val: string) => void;
  setPublicAddress: (val: string) => void;
  setClient: (val: string) => void;
}

export const UserContext = createContext({
  connectedAddress: "",
  publicAddress: "",
  client: {} as StreamrClient,
  setConnectedAddress: (val: string) => {},
  setPublicAddress: (val: string) => {},
  setClient: (val: StreamrClient) => {},
});
