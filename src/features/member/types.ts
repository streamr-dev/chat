import { Address } from '$/types'

export interface MemberState {
    notices: {
        [address: Address]: number
    }
}
