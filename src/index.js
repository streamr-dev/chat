import React from "react";
import ReactDOM from "react-dom";
import Provider from "streamr-client-react";
import {
  ChakraProvider,
  ColorModeProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import "./index.css";
import "focus-visible/dist/focus-visible";

import App from "./components/App.tsx";
import theme from "./components/theme";

ReactDOM.render(
  <ColorModeProvider
    options={{
      useSystsemColorMode: false,
    }}
  >
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </ColorModeProvider>,
  document.getElementById("root")
);
