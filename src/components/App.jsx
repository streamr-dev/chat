import React, { useState, useEffect } from "react";
import Provider from "streamr-client-react";
import axios from "axios";
import { MetaMaskProvider, useMetaMask } from "metamask-react";

import Messages from "./Messages.jsx";
import Chat from "./Chat.jsx";
import "./App.css";

const URL = "http://localhost:3000";

const App = () => {
  const [user, setUser] = useState(window.ethereum);

  return (
    <Provider
      auth={{
        ethereum: user,
      }}
    >
      <MetaMaskProvider>
        <Chat />
        <Messages />
      </MetaMaskProvider>
    </Provider>
  );
};

export default App;
