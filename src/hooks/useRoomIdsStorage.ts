import { useEffect } from 'react'
import { useStore } from '../components/Store'
import { StorageKey } from '../utils/types'

export default function useRoomIdsStorage() {
    const { account, roomIds } = useStore()

    useEffect(() => {
        if (!account || !roomIds) {
            return
        }

        const allRoomIds =
            (() => {
                try {
                    return JSON.parse(
                        localStorage.getItem(StorageKey.RoomIds) || '{}'
                    )
                } catch (e) {}
            })() || {}

        localStorage.setItem(
            StorageKey.RoomIds,
            JSON.stringify({
                ...allRoomIds,
                [account]: roomIds,
            })
        )
    }, [roomIds, account])
}
