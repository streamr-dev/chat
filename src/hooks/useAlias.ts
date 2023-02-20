import { useWalletAccount } from '$/features/wallet/hooks'
import { OptionalAddress } from '$/types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { useLiveQuery } from 'dexie-react-hooks'

export default function useAlias(address: OptionalAddress) {
    const owner = useWalletAccount()?.toLowerCase()

    const aliasee = address?.toLowerCase()

    const alias = useLiveQuery(async () => {
        if (owner && aliasee) {
            try {
                return await db.aliases
                    .where({
                        owner,
                        address: aliasee,
                    })
                    .first()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [owner, aliasee])

    return alias ? alias.alias : undefined
}
