import React, { useState, useCallback } from "react";
import { useSubscription } from "streamr-client-react";

const SampleStream = () => {
  const [price, setPrice] = useState();
  const onMessage = useCallback((message) => {
    setPrice(message.currentClose);
  }, []);

  useSubscription(
    {
      stream: "binance-streamr.eth/DOGEUSDT/ticker",
    },
    onMessage
  );

  return (
    <>
      {price ? (
        <h3 style={{ marginTop: "0px" }}>
          Dogecoin Price: <span className="price-ticker">{price}</span>
        </h3>
      ) : (
        <h3 style={{ marginTop: "0px" }}>Loading...</h3>
      )}
    </>
  );
};

export default SampleStream;
