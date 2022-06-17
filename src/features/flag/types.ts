import { Address } from '$/types'

export interface FlagState {
    [owner: Address]: {
        [index: string]: true
    }
}
