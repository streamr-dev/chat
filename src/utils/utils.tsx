import { ethers } from "ethers"
import StreamrClient, { StreamOperation } from "streamr-client"

export const addPermissions = async (
    friendAddress: string,
    connectedAddress: string,
    client: StreamrClient
): Promise<any> => {
    try {
        ethers.utils.getAddress(friendAddress)
    } catch (err) {
        return [null, err]
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let ensDecoded = await provider.resolveName(friendAddress.toLowerCase())
    if (!ensDecoded) {
        ensDecoded = friendAddress.toLowerCase()
    }
    try {
        const stream = await client.getOrCreateStream({
            id: `${connectedAddress.toLowerCase()}/streamr-chat-messages`,
        })

        if (
            !(await stream.hasPermission("stream_get" as StreamOperation, ensDecoded))
        ) {
            await stream.grantPermission("stream_get" as StreamOperation, ensDecoded)
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
            )
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
            )
        }
        const metadata = await client.getOrCreateStream({
            id: `${connectedAddress.toLowerCase()}/streamr-chat-messages`,
        })

        if (
            !(await metadata.hasPermission(
        "stream_get" as StreamOperation,
        ensDecoded
            ))
        ) {
            await metadata.grantPermission(
        "stream_get" as StreamOperation,
        ensDecoded
            )
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
            )
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
            )
        }
        return [stream, null]
    } catch (err) {
        return [null, err]
    }
}
