import React, { useState } from "react";
import "./Message.scss";
import { Box, Text, Spacer, Flex } from "@chakra-ui/react";

type PropTypes = {
  message: string;
  address: string;
  messageAddress: string;
  time: string;
};

const Message = ({ message, address, messageAddress, time }: PropTypes) => {
  const [sent, setSent] = useState(address === messageAddress);

  return (
    <Flex width="100%">
      {/* sent ? <Spacer /> : <></> */}
      <Box marginLeft={sent ? "auto" : "0"}>
        <Text color="#525252" fontSize="xs" marginBottom="-1">
          {time}
        </Text>
        <Text color="#525252" fontSize="xs" marginBottom="-1">
          {address}
        </Text>
        <Box
          borderRadius={sent ? "15px 15px 0px 15px" : "15px 15px 15px 0"}
          width={"25vw"}
          backgroundColor={sent ? "blue.200" : "gray.200"}
          marginY="3"
          marginLeft="0"
          paddingX="4"
          paddingY="2px"
        >
          <Text marginY="4" size="20px">
            {message}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;
