import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import { useShowHiddenRooms } from '$/features/preferences/hooks'

export default function useSelectedRoom() {
    const id = useSelectedRoomId() || ''

    const owner = useWalletAccount()?.toLowerCase() || ''

    const showHiddenRooms = useShowHiddenRooms()

    return useLiveQuery(
        () =>
            db.rooms
                .where({ owner, id })
                .and(({ hidden }) => showHiddenRooms || hidden !== true)
                .first(),
        [id, owner, showHiddenRooms]
    )
}
