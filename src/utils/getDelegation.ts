import { Address } from '$/types'
import MissingDelegationError from '$/errors/MissingDelegationError'
import { IDelegation } from '$/features/delegation/types'
import db from '$/utils/db'

export default async function getDelegation(owner: Address) {
    const delegation: undefined | IDelegation = await db.delegations
        .where({
            owner: owner.toLowerCase(),
        })
        .first()

    if (!delegation) {
        throw new MissingDelegationError(owner)
    }

    return delegation
}
