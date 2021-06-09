import React from "react";
import { useSubscription } from "streamr-client-react";

const Messages = () => {
  const handleMessages = () => {
    console.log(messages);
  };

  useSubscription(
    {
      auth: '1cebf9edeb9d1664e7a7a551802c9762af14721e9bc9ec4705f84d70b2b1635e',
      stream:
        "0x13327af521d2042f8bd603ee19a4f3a93daa790d/streamr-chat-messages",
    },
    handleMessages
  );

  return <h1>Messages</h1>;
};

export default Messages;
