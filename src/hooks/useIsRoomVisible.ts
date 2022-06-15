import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import { useLiveQuery } from 'dexie-react-hooks'

export default function useIsRoomVisible(roomId: undefined | RoomId) {
    const owner = useWalletAccount()?.toLowerCase() || ''

    const room = useLiveQuery(() => db.rooms.where({ id: roomId, owner }).first(), [roomId, owner])

    return Boolean(room?.hidden !== true)
}
