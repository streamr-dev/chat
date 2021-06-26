import React, { useState, useEffect } from "react";
import Provider, { useClient } from "streamr-client-react";
import axios from "axios";
import StreamrClient from "streamr-client";

import Messages from "./Messages.jsx";
import Chat from "./Chat.jsx";
import "./App.css";

const URL = "http://localhost:3000";

const App = () => {
  const [privateKey, setPrivateKey] = useState("");

  const client = useClient();

  useEffect(() => {
    const getStream = async () => {
      const stream = await client.getStream(
        "0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages"
      );

      const address = await window.ethereum.selectedAddress;

      if (
        localStorage.getItem("metamaskAddress") === null ||
        localStorage.getItem("metamaskAddress") !== address
      ) {
        console.log(user);
        const user = await StreamrClient.generateEthereumAccount();
        setPrivateKey(user.privateKey);

        if (stream.hasPermission("stream_publish", user.address) === null) {
          stream.grantPermission("stream_publish", user.address);
        }
        if (stream.hasPermission("stream_subscribe", user.address) === null) {
          stream.grantPermission("stream_subscribe", user.address);
        }
        localStorage.setItem("privateKey", user.privateKey);
        localStorage.setItem("address", user.address);
        localStorage.setItem("metamaskAddress", address);
      } else {
        setPrivateKey(localStorage.getItem("privateKey"));
      }
    };

    getStream();
    console.log(privateKey);
  }, []);

  return (
    <Provider
      auth={{
        privateKey: privateKey,
      }}
    >
      {console.log(privateKey)}
      <Chat />
      <Messages />
    </Provider>
  );
};

export default App;
