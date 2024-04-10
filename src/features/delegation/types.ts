import StreamrClient from '@streamr/sdk'
import { Address, IRecord } from '$/types'

export interface DelegationState {
    privateKey: undefined | string
    client: undefined | StreamrClient
    delegations: Record<Address, Address | null>
}

export interface IDelegation extends IRecord {
    encryptedPrivateKey: string
}
