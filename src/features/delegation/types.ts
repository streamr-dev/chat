import StreamrClient from 'streamr-client'
import { Address, IRecord } from '$/types'

export interface DelegationState {
    privateKey: undefined | string
    client: undefined | StreamrClient
    delegations: Record<Address, Address>
}

export interface IDelegation extends IRecord {
    encryptedPrivateKey: string
}
