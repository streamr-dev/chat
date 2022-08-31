import { RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import useFromTimestamp from '$/hooks/useFromTimestamp'
import db from '$/utils/db'
import { TimezoneOffset } from '$/utils/getBeginningOfDay'
import handleError from '$/utils/handleError'
import { useLiveQuery } from 'dexie-react-hooks'

export default function useResends(roomId: undefined | RoomId) {
    const owner = useWalletAccount()?.toLowerCase()

    const from = useFromTimestamp(roomId, owner)

    const resends = useLiveQuery(async () => {
        if (roomId && owner && from) {
            try {
                return await db.resends
                    .where({ roomId, owner, timezoneOffset: TimezoneOffset })
                    .and((resend) => resend.beginningOfDay >= from)
                    .toArray()
            } catch (e) {
                handleError(e)
            }
        }

        return []
    }, [roomId, owner, from])

    return resends
}
