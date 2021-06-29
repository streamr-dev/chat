import React, { useState, useEffect } from "react";
import { useClient } from "streamr-client-react";
import StreamrClient from "streamr-client";

const Chat = () => {
  const [message, setMessage] = useState("");
  const client = useClient();

  const handleSend = () => {
    if(message === '') {
      return
    }
    setMessage("");
    client.publish(
      "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-messages",
      {
        message
      }
    );
  };

  return (
    <>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button type="submit" onClick={handleSend}>
        Send
      </button>
    </>
  );
};

export default Chat;
