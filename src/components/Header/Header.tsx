import React, { useEffect } from "react";
import StreamrClient from "streamr-client";
import { ethers } from "ethers";

type Props = {
  setClient: React.Dispatch<React.SetStateAction<StreamrClient>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider>
  >;
};

const Header = ({ setClient, address, setAddress, setProvider }: Props) => {
  const { ethereum } = window;

  return (
    <>
      <h1>Streamr</h1>
      <button
        onClick={async () => {
          if (!ethereum) {
            setAddress("no wallet detected");
            return;
          }
          await window.ethereum.enable();
          const provider = new ethers.providers.Web3Provider(ethereum);
          provider.getSigner();
          await provider.send("eth_requestAccounts", []);
          if (!ethereum.selectedAddress) {
            setAddress("wallet not signed in");
            return;
          }
          const client = await new StreamrClient({
            // restUrl: 'http://localhost/api/v1', // if you want to test locally in the streamr-docker-dev environment
            auth: { ethereum },
            publishWithSignature: "never",
          });
          setClient(client);
          let ensAddress;
          try {
            ensAddress = await provider.lookupAddress(ethereum.selectedAddress);
          } catch (err) {}
          setAddress(ensAddress || ethereum.selectedAddress);
          setProvider(provider);
        }}
        key="Connect"
      >
        {address || "Connect"}
      </button>
    </>
  );
};

export default Header;
