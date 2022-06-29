import { OptionalAddress } from '$/types'
import db from '$/utils/db'
import handleError from '$/utils/handleError'
import { useLiveQuery } from 'dexie-react-hooks'

export default function useENSName(address: OptionalAddress) {
    const addr = address?.toLowerCase()

    const record = useLiveQuery(async () => {
        if (addr) {
            try {
                return await db.ensNames.where({ address: addr }).first()
            } catch (e) {
                handleError(e)
            }
        }

        return null
    }, [addr])

    return record?.content
}
