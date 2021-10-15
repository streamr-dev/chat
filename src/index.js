import React from "react"
import ReactDOM from "react-dom"
import {
    ChakraProvider
} from "@chakra-ui/react"
import "./index.css"
import "focus-visible/dist/focus-visible"

import App from "./components/App.tsx"
import theme from "./components/theme"

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById("root")
)
