import React from "react";
import Provider from "streamr-client-react";

import Messages from "./Messages.jsx";
import Chat from './Chat.jsx';
import "./App.css";

const App = () => {
  return (
    <Provider>
      <Chat />
      <Messages />
    </Provider>
  );
};

export default App;
