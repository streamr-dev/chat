import React, { useEffect, useState, useContext } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import StreamrClient from "streamr-client";
import { UserContext } from "../../contexts/UserContext";

interface PresenceMessage {
  publicAddress: string;
  timestamp: string;
}

const Users = () => {
  const { client, connectedAddress } = useContext(UserContext);
  const [presence, setPresence] = useState<PresenceMessage[]>([]);

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
  });

  return (
    <Box
      height="100vh"
      width="20vw"
      position="absolute"
      right={0}
      top={0}
      backgroundColor="gray.300"
    >
      <Heading>Users</Heading>
      {presence.map((p) => {
        return <Text>{p.publicAddress}</Text>;
      })}
    </Box>
  );
};

export default Users;
