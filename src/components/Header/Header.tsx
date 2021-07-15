import React, { useEffect, useState, useRef } from "react";
import StreamrClient, { Stream, StreamOperation } from "streamr-client";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

import {
  Button,
  Flex,
  Heading,
  Spacer,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Input,
  Image,
  Alert,
  Box,
  Menu,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import logo from "../../assets/streamr.svg";
import AddModal from './AddModal';
import { addPermissions } from '../../utils/utils';

type Props = {
  setClient: React.Dispatch<React.SetStateAction<StreamrClient>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider>
  >;
  client: StreamrClient;
  setConnectedAddress: React.Dispatch<React.SetStateAction<string>>;
  connectedAddress: string;
};

const Header = ({
  setClient,
  address,
  setAddress,
  setProvider,
  client,
  setConnectedAddress,
  connectedAddress,
}: Props) => {
  const { ethereum } = window;

  const createDisclosure = useDisclosure();
  const joinDisclosure = useDisclosure();
  const addDisclosure = useDisclosure();

  const [invalidFriendAddress, setInvalidFriendAddress] = useState(false);
  const [friendAddress, setFriendAddress] = useState("");
  const [code, setCode] = useState<Stream>({} as Stream);
  const [joinCode, setJoinCode] = useState("");
  const [rightCode, setRightCode] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [noPermissions, setNoPermissions] = useState(false);

  const isFirstRender = useRef(true);

  const handleCreate = async () => {
    try {
      const stream = await client.getOrCreateStream({
        id: `${address.toLowerCase()}/streamr-chat-messages`, // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
      });

      setCode(stream);
      setConnectedAddress(address.toLowerCase());
    } catch (err) {
      console.log(err);
      setCode({} as Stream);
    }
  };

  const handleJoin = async () => {
    const msg = {
      hello: "world",
    };

    // Publish the event to the Stream
    try {
      await client.publish(joinCode, msg);
      const words = joinCode.toLowerCase().split("/");
      setConnectedAddress(words[0]);
      /* const words = joinCode.split("/");
      setConnectedAddress(words[0]);
      const stream = await client.getOrCreateStream({
        id: `${words[0]}/streamr-chat-messages`, // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
      });

      console.log(joinCode);

      if (
        !(await stream.hasPermission(
          "stream_publish" as StreamOperation,
          joinCode
        ))
      ) {
        console.log("no permissions!");
        throw new Error("You have insufficient permissions!");
      } else {
        setRightCode(true);
        } */
      setRightCode(true);
    } catch (err) {
      console.log(err);
      /* console.log(err.message);
      if ((err.message = "You have insufficient permissions!")) {
        setNoPermissions(true);
      } else {
      } */
      setWrongCode(true);
    }
  };

  useEffect(() => {
    console.log(address);
    if (isFirstRender) {
      isFirstRender.current = false;
      handleCreate();
    }
  }, [address])

  return (
    <Flex
      direction="column"
      width="container.lg"
      position="fixed"
      backgroundColor="white"
      top="0"
      paddingY="20px"
    >
      <Flex direction="row" alignItems="center" width="container.lg">
        <Heading as="h2" size="lg">
          Streamr Chat
        </Heading>
        <Image src={logo} boxSize="50px" marginLeft="7px" />
        <Spacer />
        {address ? (
          <>
            <Tooltip label="Click to Copy" placement="bottom">
              <Button
                color="white"
                backgroundColor="#0D009A"
                _hover={{ backgroundColor: "#13013D" }}
                onClick={() => {
                  handleCreate();
                  addDisclosure.onOpen()
                }}
              >
                {address}
              </Button>
            </Tooltip>
            <AddModal disclosure={addDisclosure} client={client} code={code} address={address} setCode={setCode} setConnectedAddress={setConnectedAddress} />
          </>
        ) : (
          <Button
            color="white"
            _hover={{ backgroundColor: "#13013D" }}
            backgroundColor="#0D009A"
            onClick={async () => {
              if (!ethereum) {
                setAddress("no wallet detected");
                return;
              }
              await window.ethereum.enable();
              const provider = new ethers.providers.Web3Provider(ethereum);
              provider.getSigner();
              await provider.send("eth_requestAccounts", []);
              if (!ethereum.selectedAddress) {
                setAddress("wallet not signed in");
                return;
              }
              const client = await new StreamrClient({
                // restUrl: 'http://localhost/api/v1', // if you want to test locally in the streamr-docker-dev environment
                auth: { ethereum },
                publishWithSignature: "never",
              });
              setClient(client);
              let ensAddress;
              try {
                ensAddress = await provider.lookupAddress(
                  ethereum.selectedAddress
                );
              } catch (err) {
                console.log(err);
              }
              setAddress(ensAddress || ethereum.selectedAddress);
              setProvider(provider);
              setConnectedAddress(address.toLowerCase());
              addDisclosure.onOpen()
            }}
          >
            Connect
          </Button>
        )}
        <Menu isLazy placement="bottom-end">
          <MenuButton
            marginLeft="3"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            _hover={{ backgroundColor: "none" }}
            _expanded={{ backgroundColor: "none" }}
            _selected={{ backgroundColor: "none" }}
            _focus={{ backgroundColor: "none" }}
            _
          ></MenuButton>
          <MenuList>
            <MenuItem onClick={createDisclosure.onOpen}>Create Room</MenuItem>
            <MenuItem onClick={joinDisclosure.onOpen}>Join Room</MenuItem>
          </MenuList>
        </Menu>
        <Modal
          isOpen={createDisclosure.isOpen}
          onClose={createDisclosure.onClose}
          isCentered
        >
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
                    setFriendAddress(e.target.value);
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
                      navigator.clipboard.writeText(code.id);
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
                  onClick={createDisclosure.onClose}
                >
                  Ok
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={createDisclosure.onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="white"
                    _hover={{ backgroundColor: "#13013D" }}
                    backgroundColor="#0D009A"
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
        <Modal
          isOpen={joinDisclosure.isOpen}
          onClose={joinDisclosure.onClose}
          isCentered
        >
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
                    setRightCode(false);
                    setWrongCode(false);
                    setNoPermissions(false);
                    setJoinCode(e.target.value);
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
                  color="white"
                  _hover={{ backgroundColor: "#13013D" }}
                  backgroundColor="#0D009A"
                  ml={3}
                  disabled={!client}
                  onClick={joinDisclosure.onClose}
                >
                  Ok
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={joinDisclosure.onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="white"
                    _hover={{ backgroundColor: "#13013D" }}
                    backgroundColor="#0D009A"
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
      </Flex>
      <Text marginTop="10px">{`Room: ${connectedAddress || "Not in Room"
        }`}</Text>
    </Flex>
  );
};

export default Header;
