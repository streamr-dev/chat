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
        "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-messages"
      );

      const address = await window.ethereum.selectedAddress;

      if (
        localStorage.getItem("metamaskAddress") === null ||
        localStorage.getItem("metamaskAddress") !== address
      ) {
        const user = await StreamrClient.generateEthereumAccount();
        setPrivateKey(user.privateKey);

        stream.grantPermission("stream_publish", user.address);
        stream.grantPermission("stream_subscribe", user.address);

        localStorage.setItem("privateKey", user.privateKey);
        localStorage.setItem("address", user.address);
        localStorage.setItem("metamaskAddress", address);
      } else {
        setPrivateKey(localStorage.getItem("privateKey"));
        console.log(localStorage.getItem("address"))
      }
    };

    getStream();
  }, []);

  return (
    <>
    {
      privateKey === '' ? 
        <>Loading</>:
    <Provider
      auth={{
        privateKey: privateKey,
      }}
    >
      <Chat />
      <Messages />
    </Provider> 
    }
    </>
  );
};

export default App;
