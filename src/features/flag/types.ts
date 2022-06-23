import { RoomId } from '$/features/room/types'
import { Address } from '$/types'

export interface FlagState {
    [key: string]: true
}

export const Flag = {
    isTogglingStorageNode(roomId: RoomId, storageNodeAddress: string): string {
        return JSON.stringify(['isTogglingStorageNode', roomId, storageNodeAddress.toLowerCase()])
    },

    isGettingStorageNodes(roomId: RoomId): string {
        return JSON.stringify(['isGettingStorageNodes', roomId])
    },

    isGettingPrivacy(roomId: RoomId): string {
        return JSON.stringify(['isGettingPrivacy', roomId])
    },

    isPersistingRoomName(roomId: RoomId): string {
        return JSON.stringify(['isPersistingRoomName', roomId])
    },

    isRoomBeingDeleted(roomId: RoomId): string {
        return JSON.stringify(['isRoomBeingDeleted', roomId])
    },

    isRoomBeingPinned(roomId: RoomId, owner: Address): string {
        return JSON.stringify(['isRoomBeingPinned', roomId, owner.toLowerCase()])
    },

    isRoomBeingUnpinned(roomId: RoomId, owner: Address): string {
        return JSON.stringify(['isRoomBeingUnpinned', roomId, owner.toLowerCase()])
    },

    isPrivacyBeingChanged(roomId: RoomId): string {
        return JSON.stringify(['isPrivacyBeingChanged', roomId])
    },

    isRoomNameBeingEdited(roomId: RoomId): string {
        return JSON.stringify(['isRoomNameBeingEdited', roomId])
    },

    isInviteBeingRegistered(roomId: RoomId, invitee: Address): string {
        return JSON.stringify(['isInviteBeingRegistered', roomId, invitee.toLowerCase()])
    },

    isSyncingRoom(roomId: RoomId): string {
        return JSON.stringify(['isSyncingRoom', roomId])
    },
}
