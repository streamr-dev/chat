import { Address } from '../../../types/common'
import { RoomId } from '../room/types'

export interface PermissionState {
    items: {
        [index: RoomId]: {
            [index: Address]: {
                [index: string]: {
                    cache?: number
                    value?: boolean
                }
            }
        }
    }
}
