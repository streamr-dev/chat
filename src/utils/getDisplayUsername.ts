import { Address } from '$/types'
import db from '$/utils/db'
import trunc from '$/utils/trunc'

export default async function getDisplayUsername(address: Address) {
    const addr = address.toLowerCase()

    try {
        const aliasRecord = await db.aliases.where('address').equals(addr).first()

        if (aliasRecord) {
            return aliasRecord.alias
        }
    } catch (e) {
        // Ignore.
    }

    try {
        const ensRecord = await db.ensNames.where('address').equals(addr).first()

        if (ensRecord) {
            return ensRecord.content
        }
    } catch (e) {
        // Ignore.
    }

    return trunc(address)
}
