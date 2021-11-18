import {
    Button,
    Flex,
    Heading, Image, Spacer, Switch, Text, Tooltip,
    useColorMode,
    useColorModeValue, useDisclosure
} from "@chakra-ui/react"
import { ethers } from "ethers"
import React, { useContext, useState } from "react"
import StreamrClient, { Stream, StreamOperation } from "streamr-client"
import logo from "../../assets/streamr.svg"
import { UserContext } from "../../contexts/UserContext"
import Users from "../Users/Users"
import AddModal from "./AddModal"
import CreateModal from "./CreateModal"
import JoinModal from "./JoinModal"

type Props = {
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider>
  >;
};

const Header = ({ setProvider }: Props): any => {
    const { ethereum } = window

    const { colorMode, toggleColorMode } = useColorMode()

    const createDisclosure = useDisclosure()
    const joinDisclosure = useDisclosure()
    const addDisclosure = useDisclosure()

    const [code, setCode] = useState<Stream>({} as Stream)

    const white = useColorModeValue("white", "gray.800")

    const {
        connectedAddress,
        publicAddress,
        client,
        setConnectedAddress,
        setPublicAddress,
        setClient,
    } = useContext(UserContext)

    const handleCreate = async () => {
        try {
            const stream = await client.getOrCreateStream({
                id: `${publicAddress.toLowerCase()}/streamr-chat-messages`,
            })
            const metadataStream = await client.getOrCreateStream({
                id: `${publicAddress.toLowerCase()}/streamr-chat-metadata`,
            })
            await metadataStream.grantPermission('stream_publish' as StreamOperation, undefined)
            await metadataStream.grantPermission('stream_subscribe' as StreamOperation, undefined)
            await metadataStream.grantPermission('stream_get' as StreamOperation, undefined)
            // eslint-disable-next-line no-console
            console.log(metadataStream)
            setCode(stream)
            setConnectedAddress(publicAddress.toLowerCase())
        } catch (err) {
            console.error(err)
            setCode({} as Stream)
        }
    }

    return (
        <Flex
            direction="column"
            width="100%"
            position="fixed"
            backgroundColor={white}
            top="0"
            paddingY="20px"
            paddingX="20px"
        >
            <Flex direction="row" alignItems="center" width="100%">
                <Heading as="h2" size="lg">
          Streamr Chat
                </Heading>
                <Image src={logo} boxSize="50px" marginLeft="7px" />
                <Spacer />
                {publicAddress ? (
                    <>
                        <Tooltip label="Click to Invite" placement="bottom">
                            <Button
                                onClick={() => {
                                    addDisclosure.onOpen()
                                }}
                            >
                                {publicAddress}
                            </Button>
                        </Tooltip>
                        <AddModal
                            disclosure={addDisclosure}
                            code={code}
                            setCode={setCode}
                            handleCreate={handleCreate}
                        />
                        {connectedAddress ? <Users /> : <></>}
                    </>
                ) : (
                    <Button
                        onClick={async () => {
                            if (!ethereum) {
                                setPublicAddress("no wallet detected")
                                return
                            }
                            await window.ethereum.enable()
                            const provider = new ethers.providers.Web3Provider(ethereum)
                            provider.getSigner()
                            await provider.send("eth_requestAccounts", [])
                            if (!ethereum.selectedAddress) {
                                setPublicAddress("wallet not signed in")
                                return
                            }
                            const client = await new StreamrClient({
                                // restUrl: 'http://localhost/api/v1', // if you want to test locally in the streamr-docker-dev environment
                                auth: { ethereum },
                                publishWithSignature: "never",
                            })
                            setClient(client)
                            let ensAddress
                            try {
                                ensAddress = await provider.lookupAddress(
                                    ethereum.selectedAddress
                                )
                            } catch (err) {
                                console.log(err)
                            }
                            setPublicAddress(ensAddress || ethereum.selectedAddress)
                            setProvider(provider)
                            setConnectedAddress("")
                            addDisclosure.onOpen()
                            handleCreate()
                        }}
                    >
            Connect
                    </Button>
                )}
                <Switch
                    isChecked={colorMode === 'dark'}
                    marginLeft={"3"}
                    onChange={(e) => {
                        console.log(colorMode)
                        toggleColorMode()
                    }}
                />
                <CreateModal
                    disclosure={createDisclosure}
                    handleCreate={handleCreate}
                    code={code}
                    setCode={setCode}
                />
                <JoinModal disclosure={joinDisclosure} client={client} />
            </Flex>
            <Text marginTop="10px">{`Room: ${
                connectedAddress || "Not in Room"
            }`}</Text>
        </Flex>
    )
}

export default Header
