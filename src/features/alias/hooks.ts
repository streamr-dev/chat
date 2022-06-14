import { useWalletAccount } from '$/features/wallet/hooks'
import { OptionalAddress } from '$/types'
import db from '$/utils/db'
import { useLiveQuery } from 'dexie-react-hooks'

export function useAlias(address: OptionalAddress) {
    const owner = useWalletAccount()

    const alias = useLiveQuery(async () => {
        return db.aliases
            .where({
                owner: owner ? owner.toLowerCase() : '',
                address: address ? address.toLowerCase() : '',
            })
            .first()
    }, [owner, address])

    return alias ? alias.alias : undefined
}
