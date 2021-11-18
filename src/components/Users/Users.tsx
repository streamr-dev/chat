import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent, DrawerHeader,
    DrawerOverlay, Spinner,
    Text,
    useDisclosure
} from "@chakra-ui/react"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"

interface PresenceMessage {
  publicAddress: string;
  timestamp: string;
}

const Users = (): any => {
    const { client, connectedAddress } = useContext(UserContext)
    const [presence, setPresence] = useState<PresenceMessage[]>([])
    const { isOpen, onClose, onOpen } = useDisclosure()

    const handlePresence = (message: PresenceMessage) => {
        setPresence((oldPresence) => {
            let found = false
            const newPresence = oldPresence.map((p) => {
                if (p.publicAddress === message.publicAddress) {
                    p.timestamp = message.timestamp
                    found = true
                }
                return p
            })
            if (!found) {
                newPresence.push(message)
            }
            return newPresence
        })
    }

    useEffect(() => {
        const clearTyping = setInterval(() => {
            setPresence((oldPresence: any) => {
                return oldPresence.filter((t: any) => {
                    return t.timestamp > new Date().getTime()
                })
            })
        }, 3000)
        return () => clearInterval(clearTyping)
    }, [])

    useEffect(() => {
        const getPresence = async () => {
            await client.subscribe(
                {
                    stream: `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
                },
                handlePresence
            )
        }

        getPresence()
    }, [connectedAddress])

    return (
        <>
            <Button onClick={onOpen} variant="ghost" marginLeft="10px" marginRight='7px'>
                <FontAwesomeIcon icon={faUsers} />
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Connected Users</DrawerHeader>

                    <DrawerBody display="flex" flexDir="column">
                        {presence.length === 0 ? (
                            <Spinner marginX="auto" />
                        ) : (
                            presence.map((p) => {
                                return <Text overflowWrap="anywhere">{p.publicAddress}</Text>
                            })
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Users
