import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import StreamrClient from "streamr-client";
import { UserContext } from "../../contexts/UserContext";

interface PresenceMessage {
  publicAddress: string;
  timestamp: string;
}

const Users = ({}) => {
  const { client, connectedAddress } = useContext(UserContext);
  const [presence, setPresence] = useState<PresenceMessage[]>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handlePresence = (message: PresenceMessage) => {
    setPresence((oldPresence) => {
      let found = false;
      const newPresence = oldPresence.map((p) => {
        if (p.publicAddress === message.publicAddress) {
          p.timestamp = message.timestamp;
          found = true;
        }
        return p;
      });
      if (!found) {
        newPresence.push(message);
      }
      return newPresence;
    });
  };

  useEffect(() => {
    const clearTyping = setInterval(() => {
      setPresence((oldPresence: any) => {
        return oldPresence.filter((t: any) => {
          return t.timestamp > new Date().getTime();
        });
      });
    }, 3000);
    return () => clearInterval(clearTyping);
  }, []);

  useEffect(() => {
    const getPresence = async () => {
      await client.subscribe(
        {
          stream: `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
        },
        handlePresence
      );
    };

    getPresence();
  }, [connectedAddress]);

  return (
    <>
      <Button onClick={onOpen}>Users</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Users</DrawerHeader>

          <DrawerBody>
            {presence.map((p) => {
              return <p>{p.publicAddress}</p>;
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Users;
