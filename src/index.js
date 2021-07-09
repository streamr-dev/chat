import React from "react";
import ReactDOM from "react-dom";
import Provider from "streamr-client-react";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";

import App from "./components/App.tsx";

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
