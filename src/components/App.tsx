import React, { useState, useEffect, createContext } from "react";
import Provider, { useClient } from "streamr-client-react";
import StreamrClient, { StreamOperation } from "streamr-client";
import { ethers } from "ethers";
import { Container } from "@chakra-ui/layout";
import { BrowserRouter as Router } from "react-router-dom";

import Messages from "./Messages/Messages";
import Chat from "./Chat/Chat";
import Header from "./Header/Header";
import "./App.css";
import { UserContext } from "../contexts/UserContext";
import Users from "./Users/Users";

declare global {
  interface Window {
    ethereum: any;
  }
}

const App = () => {
  const [connectedAddress, setConnectedAddress] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const [client, setClient] = useState<StreamrClient | null>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  /* useEffect(() => {
    const initializeStream = async () => {
      const stream = await client.getStream(
        "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-messages"
      );

      const metadataStream = await client.getStream(
        "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-metadata"
      );

      const address = await window.ethereum.selectedAddress;

      if (
        localStorage.getItem("metamaskAddress") === null ||
        localStorage.getItem("metamaskAddress") !== address
      ) {
        const user = await StreamrClient.generateEthereumAccount();

        setPrivateKey(user.privateKey);

        if (
          !(await stream.hasPermission(
            StreamOperation.STREAM_PUBLISH,
            user.address
          ))
        ) {
          await stream.grantPermission(
            StreamOperation.STREAM_PUBLISH,
            user.address
          );
        }
        if (
          !(await stream.hasPermission(
            StreamOperation.STREAM_SUBSCRIBE,
            user.address
          ))
        ) {
          await stream.grantPermission(
            StreamOperation.STREAM_SUBSCRIBE,
            user.address
          );
        }
        if (
          !(await stream.hasPermission(
            StreamOperation.STREAM_GET,
            user.address
          ))
        ) {
          await stream.grantPermission(
            StreamOperation.STREAM_GET,
            user.address
          );
        }

        if (
          !(await metadataStream.hasPermission(
            StreamOperation.STREAM_PUBLISH,
            user.address
          ))
        ) {
          await metadataStream.grantPermission(
            StreamOperation.STREAM_PUBLISH,
            user.address
          );
        }
        if (
          !(await metadataStream.hasPermission(
            StreamOperation.STREAM_SUBSCRIBE,
            user.address
          ))
        ) {
          await metadataStream.grantPermission(
            StreamOperation.STREAM_SUBSCRIBE,
            user.address
          );
        }
        if (
          !(await metadataStream.hasPermission(
            StreamOperation.STREAM_GET,
            user.address
          ))
        ) {
          await metadataStream.grantPermission(
            StreamOperation.STREAM_GET,
            user.address
          );
        }

        localStorage.setItem("privateKey", user.privateKey);
        localStorage.setItem("address", user.address);
        localStorage.setItem("metamaskAddress", address);
        setPublicAddress(address);
      } else {
        setPrivateKey(localStorage.getItem("privateKey"));
        setPublicAddress(localStorage.getItem("metamaskAddress"));
      }
    };

    initializeStream();
  }, []); */

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <Router>
      <Container maxW="container.lg" paddingY="8">
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
          <Users />
        </UserContext.Provider>
      </Container>
    </Router>
  );
};

export default App;
