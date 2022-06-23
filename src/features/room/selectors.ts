import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress, PrivacySetting, State } from '$/types'
import { RoomId, RoomState } from './types'
import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'

function selectSelf(state: State): RoomState {
    return state.room
}

const selectCache = createSelector(selectSelf, ({ cache }) => cache)

export const selectSelectedRoomId = createSelector(
    selectSelf,
    ({ selectedRoomId }) => selectedRoomId
)

export function selectStorageNodeState(roomId: undefined | RoomId, address: string) {
    return createSelector(selectCache, (cache) =>
        roomId && address ? Boolean(cache[roomId]?.storageNodes?.[address.toLowerCase()]) : false
    )
}

export function selectStorageNodeToggling(roomId: undefined | RoomId, address: string) {
    if (!roomId || !address) {
        return () => false
    }

    return selectFlag(Flag.isTogglingStorageNode(roomId, address))
}

export function selectGettingStorageNodes(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isGettingStorageNodes(roomId))
}

export function selectPrivacyChanging(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isPrivacyBeingChanged(roomId))
}

export function selectPrivacy(roomId: undefined | RoomId) {
    return createSelector(
        selectCache,
        (cache) => (roomId ? cache[roomId]?.privacy : undefined) || PrivacySetting.Private
    )
}

export function selectPrivacyGetting(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isGettingPrivacy(roomId))
}

export function selectEditingRoomName(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isRoomNameBeingEdited(roomId))
}

export function selectPersistingRoomName(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isPersistingRoomName(roomId))
}

export function selectTransientRoomName(roomId: undefined | RoomId) {
    return createSelector(
        selectCache,
        (cache) => (roomId ? cache[roomId]?.temporaryName : undefined) || ''
    )
}

export function selectIsBeingDeleted(roomId: undefined | RoomId) {
    if (!roomId) {
        return () => false
    }

    return selectFlag(Flag.isRoomBeingDeleted(roomId))
}

export function selectIsPinning(owner: OptionalAddress, roomId: undefined | RoomId) {
    if (!owner || !roomId) {
        return () => false
    }

    return selectFlag(Flag.isRoomBeingPinned(roomId, owner))
}
