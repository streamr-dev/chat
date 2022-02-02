import { useEffect } from 'react'
import { StreamPermission } from 'streamr-client'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { StorageKey } from '../utils/types'
import useInviter from './useInviter'
import intersection from 'lodash/intersection'

const ROOM_PREFIX = 'streamr-chat/room'

export default function useExistingRooms() {
    const {
        account,
        session: { wallet },
        metamaskStreamrClient,
    } = useStore()

    const dispatch = useDispatch()

    const invite = useInviter()

    const sessionAccount = wallet?.address

    useEffect(() => {
        if (!metamaskStreamrClient || !account || !sessionAccount) {
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

            const streams = await metamaskStreamrClient!.searchStreams(
                ROOM_PREFIX
            )

            await Promise.allSettled(
                streams.map(async (stream) => {
                    if (!stream.id.includes(ROOM_PREFIX)) {
                        return
                    }

                    try {
                        const hasSubscribePermission =
                            await stream.hasUserPermission(
                                StreamPermission.SUBSCRIBE,
                                sessionAccount!
                            )
                        console.log(
                            'hasSubPerm',
                            hasSubscribePermission,
                            sessionAccount
                        )
                        if (!hasSubscribePermission) {
                            await invite({
                                invitees: [sessionAccount!],
                                stream,
                            })
                        }

                        // Collect up-to-date stream id for clean-up at the end.
                        remoteRoomIds.push(stream.id)

                        // Append the stream immediately so it shows up ASAP.
                        dispatch({
                            type: ActionType.AddRoomIds,
                            payload: [stream.id],
                        })
                    } catch (e) {
                        // noop
                    }
                })
            )

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
    }, [account, dispatch, invite, sessionAccount, metamaskStreamrClient])
}
