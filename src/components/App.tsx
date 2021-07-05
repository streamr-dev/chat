import React, { useState, useEffect } from "react";
import Provider, { useClient } from "streamr-client-react";
import StreamrClient from "streamr-client";

import Messages from "./Messages/Messages";
import Chat from "./Chat/Chat";
import Header from "./Header/Header";
import "./App.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

const App = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const client = useClient();

  useEffect(() => {
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

        if (!(await stream.hasPermission("stream_publish", user.address))) {
          await stream.grantPermission("stream_publish", user.address);
        }
        if (!(await stream.hasPermission("stream_subscribe", user.address))) {
          await stream.grantPermission("stream_subscribe", user.address);
        }
        if (!(await stream.hasPermission("stream_get", user.address))) {
          await stream.grantPermission("stream_get", user.address);
        }

        if (
          !(await metadataStream.hasPermission("stream_publish", user.address))
        ) {
          await metadataStream.grantPermission("stream_publish", user.address);
        }
        if (
          !(await metadataStream.hasPermission(
            "stream_subscribe",
            user.address
          ))
        ) {
          await metadataStream.grantPermission(
            "stream_subscribe",
            user.address
          );
        }
        if (!(await metadataStream.hasPermission("stream_get", user.address))) {
          await metadataStream.grantPermission("stream_get", user.address);
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
  }, []);

  return (
    <>
      {privateKey === "" || publicAddress === "" ? (
        <>Loading</>
      ) : (
        <Provider
          auth={{
            privateKey: privateKey,
          }}
        >
          <Header />
          <Chat address={publicAddress} />
          <Messages />
        </Provider>
      )}
    </>
  );
};

export default App;
