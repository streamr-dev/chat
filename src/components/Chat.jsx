import React, { useState, useEffect } from "react";
import { useClient } from "streamr-client-react";
import { useMetaMask } from "metamask-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { status, connect, account } = useMetaMask();
  const client = useClient();

  useEffect(() => {
    /*if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(ethers);
        } catch (error) {
          console.log(error);
        }
      })();
    }*/
  }, []);

  const handleSend = () => {
    setMessage("");
    client.publish(
      "0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages",
      {
        message,
      }
    );
  };

  return (
    <>
      {status === "connected" ? (
        <h1>{`Connected Account: ${account}`}</h1>
      ) : (
        <h1>Not Connected</h1>
      )}
      <button onClick={connect}>Connect</button>
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
