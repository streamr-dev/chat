import { useLiveQuery } from 'dexie-react-hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import { useShowHiddenRooms } from '$/features/preferences/hooks'
import db from '$/utils/db'

export default function useRooms() {
    const owner = useWalletAccount()?.toLowerCase() || ''

    const showHiddenRooms = useShowHiddenRooms()

    return useLiveQuery(
        () =>
            db.rooms
                .where({ owner })
                .and((room) => showHiddenRooms || room.hidden !== true)
                .toArray(),
        [owner, showHiddenRooms]
    )
}
