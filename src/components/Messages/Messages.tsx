import React, {
    useCallback,
    useState,
    useEffect,
    useRef,
    useContext,
} from "react"
import { Box } from "@chakra-ui/react"

import Message from "./Message"
import { UserContext } from "../../contexts/UserContext"

const Messages = (): any => {
    const [messages, setMessages] = useState([])

    const messagesRef = useRef(null)

    const { connectedAddress, client, publicAddress } = useContext(UserContext)

    const dotw = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }

    const scrollToBottom = () => {
        messagesRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleMessages = useCallback((m, metadata) => {
        if (!m.hasOwnProperty("message")) {
            return
        }
        const unix_timestamp = metadata.messageId.timestamp
        const date = new Date(unix_timestamp)
        const hours = date.getHours()
        const minutes = "0" + date.getMinutes()
        const seconds = "0" + date.getSeconds()
        const dayType: keyof typeof dotw = 0
        const day = date.getDay() as typeof dayType

        const formattedTime =
        dotw[day] +
        " " +
        hours +
        ":" +
        minutes.substr(-2) +
        ":" +
        seconds.substr(-2)

        setMessages((oldArray) => [
            ...oldArray,
            { ...m, time: formattedTime, id: new Date().getTime() },
        ])
    }, [])

    useEffect(() => {
        if (connectedAddress === "") {
            setMessages([])
            return
        }
        const getMessages = async () => {
            await client.subscribe(
                {
                    stream: `${connectedAddress.toLowerCase()}/streamr-chat-messages`,
                    resend: {
                        last: 10,
                    },
                },
                handleMessages
            )
        }

        getMessages()
    }, [connectedAddress])

    useEffect(() => {
        if (connectedAddress === "") {
            return
        }

        const updatePresence = setInterval(() => {
            client.publish(
                `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
                {
                    publicAddress,
                    timestamp: new Date().getTime() + 5000,
                }
            )
        }, 3000)
        return () => clearInterval(updatePresence)
    }, [connectedAddress])

    return (
        <Box paddingBottom="80px" paddingTop="100px" paddingX="20px">
            {messages.map((message) => {
                return (
                    <Message
                        message={message.message}
                        time={message.time}
                        messageAddress={message.publicAddress}
                        key={message.id}
                    />
                )
            })}
            <div ref={messagesRef} />
        </Box>
    )
}

export default Messages
