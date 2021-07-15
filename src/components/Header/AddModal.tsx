import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import StreamrClient, { Stream, StreamOperation } from "streamr-client";
import { ethers } from "ethers";
import { addPermissions } from "../../utils/utils";
import { CloseIcon } from "@chakra-ui/icons";

interface PropTypes {
  disclosure: any;
  client: StreamrClient;
  code: Stream;
  address: string;
  setCode: React.Dispatch<React.SetStateAction<Stream>>;
  setConnectedAddress: React.Dispatch<React.SetStateAction<string>>;
}

const AddModal = ({
  disclosure,
  client,
  code,
  address,
  setCode,
  setConnectedAddress,
}: PropTypes) => {
  const [friendAddress, setFriendAddress] = useState("");
  const [permissions, setPermissions] = useState([]);

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
    const [data, errors] = await addPermissions(
      friendAddress.toLowerCase(),
      address,
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
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert
            status="success"
            w="90%"
            mx="auto"
            borderRadius="5"
            display="flex"
            flexDir="column"
          >
            To chat with a friend, add their public address below and have them
            join using the following code:
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
              <Spinner />
            )}
          </Alert>
          <Text fontWeight="bold" marginTop="20px">
            Invite Friends
          </Text>
          <Flex direction="row">
            <Input
              placeholder="Friend's Public Key"
              value={friendAddress}
              onChange={(e) => {
                setFriendAddress(e.target.value);
              }}
            ></Input>
            <Button onClick={handleInvite}>Invite</Button>
          </Flex>
          <Box overflowY="scroll" height="100px">
            {permissions.map((permission) => {
              return (
                <Flex alignItems="center" paddingY="5px">
                  <Text>{permission}</Text>
                  <Spacer />
                  <Button variant="ghost">
                    <CloseIcon />
                  </Button>
                </Flex>
              );
            })}
          </Box>
        </ModalBody>

        <ModalFooter>
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
      </ModalContent>
    </Modal>
  );
};

export default AddModal;
