import { createSelector } from '@reduxjs/toolkit'
import { OptionalAddress, PrivacySetting, State } from '$/types'
import { RoomId, RoomState } from './types'

function selectSelf(state: State): RoomState {
    return state.room
}

export const selectSelectedRoomId = createSelector(selectSelf, ({ selectedId }) => selectedId)

export function selectStorageNodeState(roomId: undefined | RoomId, address: string) {
    return createSelector(selectSelf, ({ storageNodes }) =>
        roomId && address
            ? Boolean(storageNodes[roomId]?.addresses?.[address.toLowerCase()]?.state)
            : false
    )
}

export function selectStorageNodeToggling(roomId: undefined | RoomId, address: string) {
    return createSelector(selectSelf, ({ storageNodes }) =>
        roomId && address
            ? Boolean(storageNodes[roomId]?.addresses?.[address.toLowerCase()]?.toggling)
            : false
    )
}

export function selectGettingStorageNodes(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ storageNodes }) =>
        roomId ? Boolean(storageNodes[roomId]?.getting) : false
    )
}

export function selectPrivacyChanging(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ privacy }) =>
        roomId ? Boolean(privacy[roomId]?.changing) : false
    )
}

export function selectPrivacy(roomId: undefined | RoomId) {
    return createSelector(
        selectSelf,
        ({ privacy }) => (roomId ? privacy[roomId]?.value : undefined) || PrivacySetting.Private
    )
}

export function selectPrivacyGetting(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ privacy }) =>
        roomId ? Boolean(privacy[roomId]?.getting) : false
    )
}

export function selectEditingRoomName(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ temporaryNames }) =>
        roomId ? Boolean(temporaryNames[roomId]?.editing) : false
    )
}

export function selectPersistingRoomName(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ temporaryNames }) =>
        roomId ? Boolean(temporaryNames[roomId]?.persisting) : false
    )
}

export function selectTransientRoomName(roomId: undefined | RoomId) {
    return createSelector(
        selectSelf,
        ({ temporaryNames }) => (roomId ? temporaryNames[roomId]?.name : undefined) || ''
    )
}

export function selectIsBeingDeleted(roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ ongoingDeletion }) =>
        roomId ? Boolean(ongoingDeletion[roomId]) : false
    )
}

export function selectIsPinning(owner: OptionalAddress, roomId: undefined | RoomId) {
    return createSelector(selectSelf, ({ ongoingPinning }) =>
        owner && roomId ? Boolean(ongoingPinning[owner.toLowerCase()]?.[roomId]) : false
    )
}
