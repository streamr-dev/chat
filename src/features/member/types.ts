import { Address } from '../../../types/common'

export interface MemberState {
    notices: {
        [index: Address]: number
    }
}
