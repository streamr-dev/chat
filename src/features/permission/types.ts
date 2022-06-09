import { Address } from '$/types'
import { RoomId } from '../room/types'

export interface PermissionState {
    items: {
        [index: RoomId]: {
            [index: Address]: {
                fetchingAll: boolean
                permissions: {
                    [index: string]: {
                        cache?: number
                        value?: boolean
                        fetching: boolean
                    }
                }
            }
        }
    }
}
