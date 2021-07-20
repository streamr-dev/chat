import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  Text,
  Flex,
  Spinner,
  Spacer,
  InputRightElement,
  InputGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from "@chakra-ui/react";
import StreamrClient, { Stream, StreamOperation } from "streamr-client";
import { ethers } from "ethers";
import { addPermissions } from "../../utils/utils";
import { CloseIcon } from "@chakra-ui/icons";
import { getCombinedNodeFlags } from "typescript";
import { UserContext } from "../../contexts/UserContext";

interface PropTypes {
  disclosure: any;
  code: Stream;
  setCode: React.Dispatch<React.SetStateAction<Stream>>;
  handleCreate: () => void;
}

const AddModal = ({ disclosure, code, setCode, handleCreate }: PropTypes) => {
  const [friendAddress, setFriendAddress] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [rightCode, setRightCode] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [noPermissions, setNoPermissions] = useState(false);
  const [disconnected, setDisconnected] = useState(false);

  const { client, connectedAddress, publicAddress, setConnectedAddress } =
    useContext(UserContext);

  useEffect(() => {
    const getPermissions = async () => {
      if (code.getPermissions) {
        const newPermissions = await code.getPermissions();
        console.log(newPermissions);

        let newPermissionAddresses: string[] = [];
        newPermissions.forEach((permission: any) => {
          if (!newPermissionAddresses.includes(permission.user)) {
            newPermissionAddresses.push(permission.user);
          }
        });
        setPermissions(newPermissionAddresses);
      }
    };
    getPermissions();
  }, [code]);

  useEffect(() => {
    console.log(permissions);
  }, [permissions]);

  const handleInvite = async () => {
    setLoading(true);
    const [data, errors] = await addPermissions(
      friendAddress.toLowerCase(),
      connectedAddress,
      client
    );
    if (!errors) {
      const newPermissions = permissions.slice();
      if (!newPermissions.includes(friendAddress.toLowerCase())) {
        newPermissions.push(friendAddress.toLowerCase());
      }
      setPermissions(newPermissions);
    } else {
      console.log(errors);
    }
    setLoading(false);
  };

  const handleDelete = async (address: string) => {
    const currentPermissions = await code.getPermissions();
    const filteredPermissions = currentPermissions.filter((permission: any) => {
      return address === permission.user;
    });
    filteredPermissions.forEach((permission) => {
      code.revokePermission(permission.id);
    });
    const newPermissions = permissions.slice();
    if (newPermissions.includes(address.toLowerCase())) {
      const index = newPermissions.indexOf(address.toLowerCase());
      if (index > -1) {
        newPermissions.splice(index, 1);
      }
    }
    setPermissions(newPermissions);
  };

  useEffect(() => {
    console.log(connectedAddress + " " + publicAddress);
  }, [connectedAddress]);

  const handleJoin = async () => {
    const msg = {
      hello: "world",
    };
    setDisconnected(false);

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

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90vw", md: "40vw" }}>
        <Tabs
          isFitted
          defaultIndex={
            connectedAddress === publicAddress || connectedAddress === ""
              ? 0
              : 1
          }
        >
          <TabList>
            <Tab
              isDisabled={
                !(connectedAddress === publicAddress || connectedAddress === "")
              }
            >
              Invite
            </Tab>
            <Tab>Join</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ModalBody>
                {connectedAddress === publicAddress ? (
                  <>
                    <Alert
                      status="success"
                      w="90%"
                      mx="auto"
                      borderRadius="5"
                      display="flex"
                      flexDir="column"
                    >
                      To chat with a friend, add their public address below and
                      have them join using the following code:
                      {code.id ? (
                        <Tooltip label="Click to Copy" placement="bottom">
                          <Box
                            width="95%"
                            backgroundColor="#525252"
                            color="white"
                            overflow="none"
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
                      ) : (
                        <Spinner marginY="10px" />
                      )}
                    </Alert>
                    <Heading size="md" marginY="10px">
                      Invite Friends
                    </Heading>
                    <Flex direction="row">
                      <InputGroup>
                        <Input
                          placeholder="Friend's Public Key"
                          value={friendAddress}
                          pr="4.5rem"
                          onChange={(e) => {
                            setFriendAddress(e.target.value);
                          }}
                        ></Input>
                        <InputRightElement width="4.5rem">
                          <Button
                            onClick={handleInvite}
                            isLoading={loading}
                            borderRadius="0 5px 5px 0"
                          >
                            Invite
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Flex>
                    <Box overflowY="scroll" maxHeight="100px" margin="10px">
                      {permissions.map((permission) => {
                        if (permission === publicAddress) {
                          return;
                        }
                        return (
                          <Flex alignItems="center" paddingY="10px">
                            <Text>{permission}</Text>
                            <Spacer />
                            <Button
                              variant="link"
                              onClick={() => {
                                handleDelete(permission);
                              }}
                            >
                              <CloseIcon />
                            </Button>
                          </Flex>
                        );
                      })}
                    </Box>
                  </>
                ) : (
                  <Button onClick={handleCreate}>Join Personal Room</Button>
                )}
              </ModalBody>

              <ModalFooter>
                {connectedAddress === publicAddress ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setConnectedAddress("");
                    }}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <></>
                )}
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
              </ModalFooter>
            </TabPanel>
            <TabPanel>
              <Heading size="md" marginTop="10px">
                Join Room
              </Heading>
              {client ? (
                <ModalBody>
                  <Input
                    placeholder="Enter Code"
                    value={joinCode}
                    marginY="10px"
                    onChange={(e) => {
                      setRightCode(false);
                      setWrongCode(false);
                      setNoPermissions(false);
                      setDisconnected(false);
                      setJoinCode(e.target.value);
                    }}
                  ></Input>
                </ModalBody>
              ) : (
                <Alert status="error" mx="auto" borderRadius="5">
                  You must click connect before creating a room!
                </Alert>
              )}

              {wrongCode && (
                <Alert status="error" mx="auto" borderRadius="5">
                  The code you provided is invalid!
                </Alert>
              )}

              {rightCode && (
                <Alert status="success" mx="auto" borderRadius="5">
                  You successfully joined the room!
                </Alert>
              )}

              {noPermissions && (
                <Alert status="error" mx="auto" borderRadius="5">
                  You don't have sufficient permissions!
                </Alert>
              )}

              {disconnected && (
                <Alert status="success" mx="auto" borderRadius="5">
                  You successfully disconnected from the room!
                </Alert>
              )}

              <ModalFooter marginTop="10px">
                {rightCode ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setConnectedAddress("");
                        setRightCode(false);
                        setDisconnected(true);
                      }}
                    >
                      Disconnect
                    </Button>
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
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={disclosure.onClose}>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default AddModal;
