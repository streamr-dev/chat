import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Alert,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import StreamrClient from "streamr-client"
import { UserContext } from "../../contexts/UserContext"

interface Props {
  disclosure: any;
  client: StreamrClient;
}

const JoinModal = ({ disclosure, client }: Props): any => {
    const [rightCode, setRightCode] = useState(false)
    const [wrongCode, setWrongCode] = useState(false)
    const [noPermissions, setNoPermissions] = useState(false)
    const [joinCode, setJoinCode] = useState("")

    const {
        setConnectedAddress
    } = useContext(UserContext)

    const handleJoin = async () => {
        const msg = {
            hello: "world",
        }

        // Publish the event to the Stream
        try {
            await client.publish(joinCode, msg)
            const words = joinCode.toLowerCase().split("/")
            setConnectedAddress(words[0])
            setRightCode(true)
        } catch (err) {
            console.error(err)
            setWrongCode(true)
        }
    }

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Join Room</ModalHeader>
                <ModalCloseButton />
                {client ? (
                    <ModalBody>
                        <Input
                            placeholder="Enter Code"
                            value={joinCode}
                            onChange={(e) => {
                                setRightCode(false)
                                setWrongCode(false)
                                setNoPermissions(false)
                                setJoinCode(e.target.value)
                            }}
                        ></Input>
                    </ModalBody>
                ) : (
                    <Alert status="error" w="90%" mx="auto" borderRadius="5">
            You must click connect before creating a room!
                    </Alert>
                )}

                {wrongCode && (
                    <Alert status="error" w="90%" mx="auto" borderRadius="5">
            The code you provided is invalid!
                    </Alert>
                )}

                {rightCode && (
                    <Alert status="success" w="90%" mx="auto" borderRadius="5">
            You successfully joined the room!
                    </Alert>
                )}

                {noPermissions && (
                    <Alert status="error" w="90%" mx="auto" borderRadius="5">
            You don't have sufficient permissions!
                    </Alert>
                )}

                <ModalFooter>
                    {rightCode ? (
                        <Button
                            ml={3}
                            disabled={!client}
                            onClick={disclosure.onClose}
                        >
              Ok
                        </Button>
                    ) : (
                        <>
                            <Button variant='secondary' onClick={disclosure.onClose}>
                Cancel
                            </Button>
                            <Button
                                ml={3}
                                disabled={!client}
                                onClick={handleJoin}
                            >
                Confirm
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default JoinModal
