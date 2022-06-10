import StreamrClient from 'streamr-client'
import { IRecord } from '$/types'

export interface DelegationState {
    privateKey: undefined | string
    client: undefined | StreamrClient
    delegating: boolean
}

export interface IDelegation extends IRecord {
    encryptedPrivateKey: string
}
