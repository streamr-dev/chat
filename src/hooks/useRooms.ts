import { useLiveQuery } from 'dexie-react-hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'

export default function useRooms() {
    const account = useWalletAccount()

    return useLiveQuery(
        () => db.rooms.where({ owner: (account || '').toLowerCase() }).toArray(),
        [account]
    )
}
