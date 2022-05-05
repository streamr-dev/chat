import { StreamID, toStreamPartID } from 'streamr-client-protocol'

import { useCallback } from 'react'
import { getTrackerRegistryFromContract } from 'streamr-client'
import { useStore } from '../components/Store'

type Options = {
    streamId: StreamID
}

type OnlineRoomMemberGetter = ({ streamId }: Options) => Promise<string[]>

const TrackerRegistrySmartContractAddress =
    '0xab9BEb0e8B106078c953CcAB4D6bF9142BeF854d'

export default function useGetOnlineRoomMembers(): OnlineRoomMemberGetter {
    const {
        session: { streamrClient, wallet },
    } = useStore()

    return useCallback(
        async ({ streamId }: Options) => {
            if (!wallet) {
                throw new Error('No session wallet found')
            }
            const provider = streamrClient!.getMainnetProvider()
            const registry = await getTrackerRegistryFromContract({
                contractAddress: TrackerRegistrySmartContractAddress,
                jsonRpcProvider: provider,
            })
            const tracker = registry.getTracker(toStreamPartID(streamId, 0))
            const streamUrl = `${tracker.http}/topology/${encodeURIComponent(
                streamId
            )}`
            const json = await (await fetch(streamUrl)).json()

            // clear the sessionIds and return the online addresses
            return Object.keys(json[`${streamId}#0`] || {}).map(
                (key) => key.split('#')[0]
            )
        },
        [streamrClient, wallet]
    )
}
