import React from "react";
import ReactDOM from "react-dom";
import Provider from "streamr-client-react";
import "./index.css";

import App from "./components/App.tsx";

ReactDOM.render(
  <Provider
    auth={{
      ethereum: window.ethereum,
    }}
  >
    <App />
  </Provider>,
  document.getElementById("root")
);
