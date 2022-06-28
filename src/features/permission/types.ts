import { Address } from '$/types'
import { RoomId } from '../room/types'

export interface PermissionState {
    [roomId: RoomId]: {
        [member: Address]: {
            [permission: string]: {
                cache?: number
                value?: boolean
            }
        }
    }
}
