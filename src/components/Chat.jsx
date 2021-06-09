import React, { useState } from "react";
import { useClient } from "streamr-client-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const client = useClient();

  const handleSend = () => {
    console.log(message);
    client.publish("0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages", {
      message
    })
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
