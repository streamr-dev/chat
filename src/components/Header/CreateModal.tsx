import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Input,
    Alert,
    Tooltip,
    Box,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { Stream } from "streamr-client"
import { UserContext } from "../../contexts/UserContext"

interface Props {
  disclosure: any;
  handleCreate: () => void;
  code: Stream;
  setCode: React.Dispatch<React.SetStateAction<Stream>>;
}

const CreateModal = ({ disclosure, handleCreate, code }: Props): any => {
    const [invalidFriendAddress] = useState(false)
    const [friendAddress, setFriendAddress] = useState("")

    const { client } = useContext(UserContext)

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Room</ModalHeader>
                <ModalCloseButton />
                {client ? (
                    <ModalBody>
                        <Input
                            placeholder="Friend's Public Address"
                            value={friendAddress}
                            onChange={(e) => {
                                setFriendAddress(e.target.value)
                            }}
                        ></Input>
                    </ModalBody>
                ) : (
                    <Alert status="error" w="90%" mx="auto" borderRadius="5">
            You must click connect before creating a room!
                    </Alert>
                )}

                {invalidFriendAddress && (
                    <Alert status="error" w="90%" mx="auto" borderRadius="5">
            Invalid Public Address!
                    </Alert>
                )}

                {code.id && (
                    <Alert
                        status="success"
                        w="90%"
                        mx="auto"
                        borderRadius="5"
                        display="flex"
                        flexDir="column"
                    >
            Room successfully created! Ask your friend to enter the code:{" "}
                        <Tooltip label="Click to Copy" placement="bottom">
                            <Box
                                width="95%"
                                backgroundColor="#525252"
                                color="white"
                                overflow="scroll"
                                borderRadius="5px"
                                paddingY="5px"
                                paddingX="10px"
                                marginY="5px"
                                onClick={() => {
                                    navigator.clipboard.writeText(code.id)
                                }}
                            >
                                {code.id}
                            </Box>
                        </Tooltip>
                    </Alert>
                )}

                <ModalFooter>
                    {code.id ? (
                        <Button
                            color="white"
                            _hover={{ backgroundColor: "#13013D" }}
                            backgroundColor="#0D009A"
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
                                onClick={handleCreate}
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

export default CreateModal
