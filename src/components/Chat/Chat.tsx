import { Button, Input, Flex } from "@chakra-ui/react"
import React, { useState, useEffect, useContext } from "react"

import "./Chat.scss"
import { UserContext } from "../../contexts/UserContext"

type Metadata = {
  isTyping: boolean;
  time: number;
  address: string;
};

const Chat = (): any => {
    const [message, setMessage] = useState("")
    const [typing, setTyping] = useState([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reducedTyping, setReducedTyping] = useState([])

    const { connectedAddress, publicAddress, client } = useContext(UserContext)

    const handleSend = async () => {
        if (message === "") {
            return
        }
        setMessage("")
        await client.publish(`${connectedAddress}/streamr-chat-messages`, {
            message,
            publicAddress,
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateMetadata = () => {
        client.publish(
            `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
            {
                isTyping: true,
                time: new Date().getTime() + 5000,
                publicAddress,
            }
        )
    }

    const updateTyping = (m: Metadata) => {
        setTyping((oldArray) => [...oldArray, m])
    }

    useEffect(() => {
        const clearTyping = setInterval(() => {
            setTyping(
                typing.filter((t) => {
                    return t.time > new Date().getTime()
                })
            )
        }, 3000)
        return () => clearInterval(clearTyping)
    }, [])

    const handleKeypress = (e: any) => {
    //it triggers by pressing the enter key
        if (e.key === "Enter") {
            handleSend()
        }
    }

    useEffect(() => {
        const getMessages = async () => {
            if (!client) {return}
            await client.subscribe(
                {
                    stream:
            `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
                },
                updateTyping
            )
        }
    
        getMessages()
    }, [])

    useEffect(() => {
        const newTyping = []
        for (const i in typing) {
            let found = false
            for (let j = 0; j < newTyping.length; j++) {
                if (newTyping[j].address === typing[i].address) {
                    found = true
                    break
                }
            }
            if (!found) {
                newTyping.push(typing[i])
            }
        }
        setReducedTyping(newTyping)
    }, [typing])

    return (
        <>
            {/* <div className="inputWrapper">
        {reducedTyping.map((t) => {
          if (address === t.address) {
            return;
          }
          return <p style={{}}>{t.address} is typing...</p>;
        })} */}
            <Flex
                position="fixed"
                bottom="0px"
                direction="row"
                width="100vw"
                backgroundColor="white"
                paddingY="20px"
                paddingX="20px"
            >
                <Input
                    type="text"
                    placeholder="Message"
                    width="100%"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        // updateMetadata();
                    }}
                    disabled={connectedAddress === ""}
                    onKeyPress={handleKeypress}
                ></Input>
                <Button
                    type="submit"
                    bgColor="#ff5c00"
                    color="white"
                    disabled={connectedAddress === ""}
                    paddingX="30px"
                    marginLeft="10px"
                    onClick={handleSend}
                >
          Send
                </Button>
            </Flex>
        </>
    )
}

export default Chat
