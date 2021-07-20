import { ethers } from "ethers";
import StreamrClient, { StreamOperation, Stream } from "streamr-client";

export const addPermissions = async (
  friendAddress: string,
  connectedAddress: string,
  client: StreamrClient
) => {
  try {
    ethers.utils.getAddress(friendAddress);
  } catch (err) {
    return [null, err];
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let ensDecoded = await provider.resolveName(friendAddress.toLowerCase());
  if (!ensDecoded) {
    ensDecoded = friendAddress.toLowerCase();
  }
  try {
    const stream = await client.getOrCreateStream({
      id: `${connectedAddress.toLowerCase()}/streamr-chat-messages`, // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
    });

    if (
      !(await stream.hasPermission("stream_get" as StreamOperation, ensDecoded))
    ) {
      await stream.grantPermission("stream_get" as StreamOperation, ensDecoded);
    }
    if (
      !(await stream.hasPermission(
        "stream_publish" as StreamOperation,
        ensDecoded
      ))
    ) {
      await stream.grantPermission(
        "stream_publish" as StreamOperation,
        ensDecoded
      );
    }
    if (
      !(await stream.hasPermission(
        "stream_subscribe" as StreamOperation,
        ensDecoded
      ))
    ) {
      await stream.grantPermission(
        "stream_subscribe" as StreamOperation,
        ensDecoded
      );
    }
    const metadata = await client.getOrCreateStream({
      id: `${connectedAddress.toLowerCase()}/streamr-chat-messages`, // or 0x1234567890123456789012345678901234567890/foo/bar or mydomain.eth/foo/bar
    });

    if (
      !(await metadata.hasPermission(
        "stream_get" as StreamOperation,
        ensDecoded
      ))
    ) {
      await metadata.grantPermission(
        "stream_get" as StreamOperation,
        ensDecoded
      );
    }
    if (
      !(await metadata.hasPermission(
        "stream_publish" as StreamOperation,
        ensDecoded
      ))
    ) {
      await metadata.grantPermission(
        "stream_publish" as StreamOperation,
        ensDecoded
      );
    }
    if (
      !(await metadata.hasPermission(
        "stream_subscribe" as StreamOperation,
        ensDecoded
      ))
    ) {
      await metadata.grantPermission(
        "stream_subscribe" as StreamOperation,
        ensDecoded
      );
    }
    return [stream, null];
  } catch (err) {
    return [null, err];
  }
};
