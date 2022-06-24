import { useWalletAccount } from '$/features/wallet/hooks'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { useLiveQuery } from 'dexie-react-hooks'

export function usePreferences() {
    const owner = useWalletAccount()?.toLowerCase()

    return useLiveQuery(async () => {
        if (owner) {
            try {
                return await db.preferences.where({ owner }).first()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [owner])
}

export function useShowHiddenRooms() {
    return Boolean(usePreferences()?.showHiddenRooms)
}
