import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function usePreferences() {
    const owner = useWalletAccount()?.toLowerCase() || ''

    return useLiveQuery(() => db.preferences.where({ owner }).first(), [owner])
}

export function useShowHiddenRooms() {
    return Boolean(usePreferences()?.showHiddenRooms)
}
