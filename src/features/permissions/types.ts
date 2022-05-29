import { Address } from '../../../types/common'
import { RoomId } from '../rooms/types'

export interface PermissionsState {
    items: {
        [index: RoomId]: {
            [index: Address]: {
                [index: string]: boolean
            }
        }
    }
}
