import React, { useCallback, useState, useEffect } from "react";
import StreamrClient from "streamr-client";
import { Container, Box } from "@chakra-ui/react";

import Message from "./Message";

type Props = {
  address: string;
  connectedAddress: string;
  client: StreamrClient;
};

const Messages = ({ address, connectedAddress, client }: Props) => {
  const [messages, setMessages] = useState([]);

  const dotw = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const handleMessages = useCallback((m, metadata) => {
    if (!m.hasOwnProperty("message")) {
      return;
    }
    let unix_timestamp = metadata.messageId.timestamp;
    var date = new Date(unix_timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    let day: keyof typeof dotw;
    day = date.getDay() as typeof day;

    var formattedTime =
      dotw[day] +
      " " +
      hours +
      ":" +
      minutes.substr(-2) +
      ":" +
      seconds.substr(-2);

    setMessages((oldArray) => [
      ...oldArray,
      { ...m, time: formattedTime, id: new Date().getTime() },
    ]);
  }, []);

  useEffect(() => {
    console.log(connectedAddress.toLowerCase());
    const getMessages = async () => {
      await client.subscribe(
        {
          stream: `${connectedAddress.toLowerCase()}/streamr-chat-messages`,
          resend: {
            last: 10,
          },
        },
        handleMessages
      );
    };

    getMessages();
  }, [connectedAddress]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <Box marginTop="20px">
      {messages.map((message) => {
        return (
          <Message
            message={message.message}
            time={message.time}
            messageAddress={message.address}
            address={address}
            key={message.id}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
