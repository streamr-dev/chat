import React, { useCallback, useState } from "react";
import { useSubscription } from "streamr-client-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const dotw = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  }

  const handleMessages = useCallback((m, metadata) => {
    let unix_timestamp = metadata.messageId.timestamp;
    var date = new Date(unix_timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    let day = date.getDay();

    var formattedTime =
      dotw[day] + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    setMessages([...messages, { ...m, time: formattedTime }]);
  });

  useSubscription(
    {
      stream:
        "0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages",
    },
    handleMessages
  );

  return (
    <>
      {messages.map((message) => {
        return <p>{message.time + " " + message.message}</p>;
      })}
    </>
  );
};

export default Messages;
