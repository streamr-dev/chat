import { useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { StorageKey } from '../utils/types'
import intersection from 'lodash/intersection'
import useInviterSelf from './useInviterSelf'
import getRoomMetadata from '../getters/getRoomMetadata'

export const ROOM_PREFIX = 'streamr-chat/room'

export default function useExistingRooms() {
    const {
        account,
        session: { wallet, streamrClient },
        metamaskStreamrClient,
        roomId,
    } = useStore()

    const dispatch = useDispatch()

    const inviteSelf = useInviterSelf()

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

        // select the first room, if any
        if (!roomId && localRoomIds.length > 0) {
            dispatch({
                type: ActionType.SelectRoom,
                payload: localRoomIds[0],
            })
        }

        async function fn() {
            const remoteRoomIds: string[] = []
            const streams = metamaskStreamrClient!.searchStreams(ROOM_PREFIX, {
                user: account!,
                anyOf: [StreamPermission.GRANT, StreamPermission.SUBSCRIBE],
                allowPublic: true,
            })

            const selfInviteStreams: string[] = []
            for await (const stream of streams) {
                try {
                    const metadata = getRoomMetadata(stream.description!)

                    const hasPermission = await stream.hasPermission({
                        user: sessionAccount!,
                        permission: StreamPermission.SUBSCRIBE,
                        allowPublic: true,
                    })

                    if (!hasPermission && metadata.privacy !== 'public') {
                        selfInviteStreams.push(stream.id)
                    }
                    remoteRoomIds.push(stream.id)
                    dispatch({
                        type: ActionType.AddRoomIds,
                        payload: [stream.id],
                    })
                } catch (e) {
                    // noop
                }
            }

            if (selfInviteStreams.length > 0) {
                await inviteSelf({
                    streamIds: selfInviteStreams,
                })
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

            if (!roomId && remoteRoomIds.length > 0) {
                dispatch({
                    type: ActionType.SelectRoom,
                    payload: remoteRoomIds[0],
                })
            }
        }

        fn()
    }, [
        account,
        dispatch,
        inviteSelf,
        roomId,
        sessionAccount,
        streamrClient,
        metamaskStreamrClient,
    ])
}
