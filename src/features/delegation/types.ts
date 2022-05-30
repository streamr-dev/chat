import StreamrClient from 'streamr-client'
import { IRecord } from '../../../types/common'

export interface DelegationState {
    privateKey: undefined | string
    client: undefined | StreamrClient
}

export interface IDelegation extends IRecord {
    encryptedPrivateKey: string
}
