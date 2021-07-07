import React, { useState, useEffect } from "react";
import { useClient } from "streamr-client-react";

import "./Chat.scss";

type Metadata = {
  isTyping: boolean;
  time: number;
  address: string;
};

const Chat = ({ address }: { address: string }) => {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState([]);
  const [reducedTyping, setReducedTyping] = useState([]);
  const client = useClient();

  const handleSend = () => {
    if (message === "") {
      return;
    }
    setMessage("");
    client.publish(
      "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-messages",
      {
        message,
        address,
      }
    );
  };

  const updateMetadata = () => {
    client.publish(
      "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-metadata",
      {
        isTyping: true,
        time: new Date().getTime() + 5000,
        address,
      }
    );
  };

  const updateTyping = (m: Metadata) => {
    setTyping((oldArray) => [...oldArray, m]);
  };

  useEffect(() => {
    const clearTyping = setInterval(() => {
      setTyping(
        typing.filter((t) => {
          return t.time > new Date().getTime();
        })
      );
    }, 3000);
    return () => clearInterval(clearTyping);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      await client.subscribe(
        {
          stream:
            "0x783c81633290fa641b7bacc5c9cee4c2d709c2e3/streamr-chat-metadata",
        },
        updateTyping
      );
    };

    getMessages();
  }, []);

  useEffect(() => {
    const newTyping = [];
    for (var i in typing) {
      let found = false;
      for (var j = 0; j < newTyping.length; j++) {
        if (newTyping[j].address === typing[i].address) {
          found = true;
          break;
        }
      }
      if (!found) {
        newTyping.push(typing[i]);
      }
    }
    setReducedTyping(newTyping);
  }, [typing]);

  useEffect(() => {
    console.log(reducedTyping);
  }, [reducedTyping]);

  return (
    <>
      <div className="inputWrapper">
        {reducedTyping.map((t) => {
          if (address === t.address) {
            return;
          }
          return <p style={{}}>{t.address} is typing...</p>;
        })}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              updateMetadata();
            }}
            className="input"
          ></input>
          <button type="submit" className="submitButton" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
