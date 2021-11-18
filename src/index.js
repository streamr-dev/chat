import {
    ChakraProvider
} from "@chakra-ui/react"
import "focus-visible/dist/focus-visible"
import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App.tsx"
import theme from "./components/theme"
import "./index.css"

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById("root")
)
