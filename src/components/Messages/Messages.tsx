import React, { useCallback, useState, useEffect } from "react";
import { useClient } from "streamr-client-react";

import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const client = useClient();

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
    const getMessages = async () => {
      await client.subscribe(
        {
          stream:
            "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-messages",
          resend: {
            last: 10,
          },
        },
        handleMessages
      );
    };

    getMessages();
  }, []);

  return (
    <div style={{ margin: "80px" }}>
      {messages.map((message) => {
        return (
          <Message
            message={message.message}
            time={message.time}
            address={message.address}
            key={message.id}
          />
        );
      })}
    </div>
  );
};

export default Messages;
