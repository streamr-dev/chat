import React, { useCallback, useState } from "react";
import { useSubscription } from "streamr-client-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const handleMessages = useCallback((m, metadata) => {
    let unix_timestamp = metadata.messageId.timestamp;
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

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
