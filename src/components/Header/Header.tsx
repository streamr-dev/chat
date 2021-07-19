import React, { useEffect, useState, useRef, useContext } from "react";
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
  Switch,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import logo from "../../assets/streamr.svg";
import AddModal from "./AddModal";
import { addPermissions } from "../../utils/utils";
import JoinModal from "./JoinModal";
import { UserContext } from "../../contexts/UserContext";
import CreateModal from "./CreateModal";

type Props = {
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider>
  >;
};

const Header = ({ setProvider }: Props) => {
  const { ethereum } = window;

  const { colorMode, toggleColorMode } = useColorMode();

  const createDisclosure = useDisclosure();
  const joinDisclosure = useDisclosure();
  const addDisclosure = useDisclosure();

  const [code, setCode] = useState<Stream>({} as Stream);

  const isFirstRender = useRef(true);

  const white = useColorModeValue("white", "gray.800");

  const {
    connectedAddress,
    publicAddress,
    client,
    setConnectedAddress,
    setPublicAddress,
    setClient,
  } = useContext(UserContext);

  const handleCreate = async () => {
    try {
      const stream = await client.getOrCreateStream({
        id: `${publicAddress.toLowerCase()}/streamr-chat-messages`, // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
      });
      console.log(stream);

      setCode(stream);
      setConnectedAddress(publicAddress.toLowerCase());
    } catch (err) {
      console.log(err);
      setCode({} as Stream);
    }
  };

  // useEffect(() => {
  //   if (isFirstRender) {
  //     isFirstRender.current = false;
  //     handleCreate();
  //   }
  // }, [publicAddress]);

  return (
    <Flex
      direction="column"
      width="container.lg"
      position="fixed"
      backgroundColor={white}
      top="0"
      paddingY="20px"
    >
      <Flex direction="row" alignItems="center" width="container.lg">
        <Heading as="h2" size="lg">
          Streamr Chat
        </Heading>
        <Image src={logo} boxSize="50px" marginLeft="7px" />
        <Spacer />
        {publicAddress ? (
          <>
            <Tooltip label="Click to Invite" placement="bottom">
              <Button
                color="white"
                backgroundColor="#0D009A"
                _hover={{ backgroundColor: "#13013D" }}
                onClick={() => {
                  addDisclosure.onOpen();
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
          </>
        ) : (
          <Button
            color="white"
            _hover={{ backgroundColor: "#13013D" }}
            backgroundColor="#0D009A"
            onClick={async () => {
              if (!ethereum) {
                setPublicAddress("no wallet detected");
                return;
              }
              await window.ethereum.enable();
              const provider = new ethers.providers.Web3Provider(ethereum);
              provider.getSigner();
              await provider.send("eth_requestAccounts", []);
              if (!ethereum.selectedAddress) {
                setPublicAddress("wallet not signed in");
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
              setPublicAddress(ensAddress || ethereum.selectedAddress);
              setProvider(provider);
              setConnectedAddress("");
              addDisclosure.onOpen();
            }}
          >
            Connect
          </Button>
        )}
        {/* <Switch
          value={colorMode}
          onChange={(e) => {
            console.log(colorMode);
            toggleColorMode();
          }}
        /> */}
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
  );
};

export default Header;
