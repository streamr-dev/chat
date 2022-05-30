import { Address } from '../../types/common'
import MissingDelegationError from '../errors/MissingDelegationError'
import { IDelegation } from '../features/delegation/types'
import db from '../utils/db'

export default async function getDelegation(address: Address) {
    const delegation: undefined | IDelegation = await db.delegations
        .where({
            owner: address.toLowerCase(),
        })
        .first()

    if (!delegation) {
        throw new MissingDelegationError(address)
    }

    return delegation
}
