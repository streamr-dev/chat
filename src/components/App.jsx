import React, { useState, useEffect } from "react";
import Provider from "streamr-client-react";
import axios from 'axios';

import Messages from "./Messages.jsx";
import Chat from "./Chat.jsx";
import "./App.css";

const URL = 'http://localhost:3000';

const App = () => {
  const [user, setUser] = useState({});
  const [privateKey, setPrivateKey] = useState();
  
  useEffect(() => {
    const getUser = async () => {
      const newUser = await axios.get(`${URL}/generateuser`)
      setUser(newUser);
      setPrivateKey(newUser.data.privateKey)
      await axios.post(`${URL}/adduser`, {user: newUser.data.address })
    }
    getUser();
    console.log("hello");
  }, [])

  return (
    <Provider
      auth={{
        privateKey: privateKey
      }}
    >
      <Chat />
      <Messages />
    </Provider>
  );
};

export default App;
