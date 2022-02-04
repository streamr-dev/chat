import { useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { MessageType, StorageKey } from '../utils/types'
import useInviter from './useInviter'
import { v4 as uuidv4 } from 'uuid'
import intersection from 'lodash/intersection'
import getRoomNameFromRoomId from '../getters/getRoomNameFromRoomId'

const ROOM_PREFIX = 'streamr-chat/room'

export default function useExistingRooms() {
    const {
        account,
        session: { wallet, streamrClient },
        metamaskStreamrClient,
    } = useStore()

    const dispatch = useDispatch()

    const invite = useInviter()

    const sessionAccount = wallet?.address

    useEffect(() => {
        if (
            !metamaskStreamrClient ||
            !account ||
            !sessionAccount ||
            !streamrClient
        ) {
            return
        }

        const localRoomIds =
            ((): string[] | undefined => {
                try {
                    return JSON.parse(
                        localStorage.getItem(StorageKey.RoomIds) || '{}'
                    )[account]
                } catch (e) {}
            })() || []

        dispatch({
            type: ActionType.SetRoomIds,
            payload: localRoomIds,
        })

        async function fn() {
            const remoteRoomIds: string[] = []
            const streams = metamaskStreamrClient!.searchStreams(ROOM_PREFIX, {
                user: account!,
                anyOf: [StreamPermission.GRANT],
                allowPublic: true,
            })

            for await (const stream of streams) {
                try {
                    if (
                        stream.description !== getRoomNameFromRoomId(stream.id)
                    ) {
                        continue
                    }

                    // Collect up-to-date stream id for clean-up at the end.
                    remoteRoomIds.push(stream.id)

                    const hasPermission = await stream.hasUserPermission(
                        StreamPermission.SUBSCRIBE,
                        sessionAccount!
                    )

                    if (hasPermission) {
                        continue
                    }

                    await invite({
                        invitees: [sessionAccount!],
                        stream,
                    })

                    // check for an invite-accept and notify the metadata partition
                    const streamAddress = stream.id.split('/')[0]

                    if (streamAddress !== account) {
                        streamrClient!.publish(
                            stream.id,
                            {
                                type: 'accept-invite',
                                timestamp: Date.now(),
                                id: uuidv4(),
                                from: account,
                            },
                            Date.now(),
                            MessageType.Metadata
                        )
                    }

                    // Append the stream immediately so it shows up ASAP.
                    dispatch({
                        type: ActionType.AddRoomIds,
                        payload: [stream.id],
                    })
                } catch (e) {
                    // noop
                }
            }
            // Update the entire list. It's here mostly to eliminate stale rooms (ones that exist
            // in localStorage but are no longer available online).
            dispatch({
                type: ActionType.SetRoomIds,
                payload: [
                    // Ids from localStorage stay on top (first loaded, first served). `SetRoomIds`
                    // action takes care of uniqueness.
                    ...intersection(localRoomIds, remoteRoomIds),
                    ...remoteRoomIds,
                ],
            })
        }

        fn()
    }, [
        account,
        dispatch,
        invite,
        sessionAccount,
        metamaskStreamrClient,
        streamrClient,
    ])
}
