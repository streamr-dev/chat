import { IdenticonSeed } from '$/features/identicons/types'
import { RoomId } from '$/features/room/types'
import { Address } from '$/types'
import { StreamPermission } from 'streamr-client'

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

    isMemberBeingAdded(roomId: RoomId, member: Address): string {
        return JSON.stringify(['isMemberBeingAdded', roomId, member.toLowerCase()])
    },

    isMemberBeingRemoved(roomId: RoomId, member: Address): string {
        return JSON.stringify(['isMemberBeingRemoved', roomId, member.toLowerCase()])
    },

    isInviteBeingAccepted(roomId: RoomId, member: Address, delegatedAddress: Address): string {
        return JSON.stringify([
            'isInviteBeingAccepted',
            roomId,
            member.toLowerCase(),
            delegatedAddress.toLowerCase(),
        ])
    },

    isDelegatedAccountBeingPromoted(roomId: RoomId, delegatedAddress: Address): string {
        return JSON.stringify([
            'isDelegatedAccountBeingPromoted',
            roomId,
            delegatedAddress.toLowerCase(),
        ])
    },

    isDetectingMembers(roomId: RoomId): string {
        return JSON.stringify(['isDetectingMembers', roomId])
    },

    isFetchingAllPermissions(roomId: RoomId, member: Address): string {
        return JSON.stringify(['isFetchingAllPermissions', roomId, member.toLowerCase()])
    },

    isPermissionBeingFetched(
        roomId: RoomId,
        member: Address,
        permission: StreamPermission
    ): string {
        return JSON.stringify([
            'isPermissionBeingFetched',
            roomId,
            member.toLowerCase(),
            permission,
        ])
    },

    isAccessBeingDelegated(delegator: Address): string {
        return JSON.stringify(['isAccessBeingDelegated', delegator.toLowerCase()])
    },

    isIdenticonBeingRetrieved(seed: IdenticonSeed): string {
        return JSON.stringify(['isIdenticonBeingRetrieved', seed])
    },

    areMembersBeingFetched(roomId: RoomId): string {
        return JSON.stringify(['areMembersBeingFetched', roomId])
    },

    isENSNameBeingStored(name: string): string {
        return JSON.stringify(['isENSNameBeingStored', name.toLowerCase()])
    },
}
