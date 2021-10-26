import { Box, useColorModeValue } from "@chakra-ui/react";
import React, {
  useCallback, useContext, useEffect,
  useRef, useState
} from "react";
import { UserContext } from "../../contexts/UserContext";
import Message from "./Message";


const Messages = () => {
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef(null);

  const { connectedAddress, client, publicAddress } = useContext(UserContext);

  const white = useColorModeValue("white", "gray.800");

  const dotw = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (connectedAddress === "") {
      setMessages([]);
      return;
    }
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
    if (connectedAddress === "") {
      return;
    }
    const updatePresence = setInterval(() => {
      console.log("log!");
      client.publish(
        `${connectedAddress.toLowerCase()}/streamr-chat-metadata`,
        {
          publicAddress,
          timestamp: new Date().getTime() + 5000,
        }
      );
    }, 3000);
    return () => clearInterval(updatePresence);
  }, [connectedAddress]);

  return (
    <>
    {
      messages.length === 0 ? 
      <Box backgroundColor={white} height='full' paddingBottom="80px" paddingTop="100px" paddingX="20px">
        <div ref={messagesRef} />
      </Box> :
      <Box backgroundColor={white} paddingBottom="80px" paddingTop="100px" paddingX="20px">
        {messages.map((message) => {
          return (
            <Message
              message={message.message}
              time={message.time}
              messageAddress={message.publicAddress}
              key={message.id}
            />
          );
        })}
        <div ref={messagesRef} />
      </Box>
      }
    </>
    
  );
};

export default Messages;
