import { Address } from '$/types'

export interface MemberState {
    notices: {
        [index: Address]: number
    }
}
