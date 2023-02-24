import { useSelector } from 'react-redux'

import {
    selectEditingRoomName,
    selectGettingStorageNodes,
    selectIsBeingDeleted,
    selectPersistingRoomName,
    selectSelectedRoomId,
    selectStorageNodeState,
    selectStorageNodeToggling,
    selectTransientRoomName,
} from './selectors'
import { RoomId } from './types'

export function useSelectedRoomId() {
    return useSelector(selectSelectedRoomId)
}

export function useStorageNodeState(roomId: undefined | RoomId, address: string) {
    return useSelector(selectStorageNodeState(roomId, address))
}

export function useStorageNodeToggling(roomId: undefined | RoomId, address: string) {
    return useSelector(selectStorageNodeToggling(roomId, address))
}

export function useGettingStorageNodes(roomId: undefined | RoomId) {
    return useSelector(selectGettingStorageNodes(roomId))
}

export function useEditingRoomName(roomId: undefined | RoomId) {
    return useSelector(selectEditingRoomName(roomId))
}

export function usePersistingRoomName(roomId: undefined | RoomId) {
    return useSelector(selectPersistingRoomName(roomId))
}

export function useTransientRoomName(roomId: undefined | RoomId) {
    return useSelector(selectTransientRoomName(roomId))
}

export function useIsBeingDeleted(roomId: undefined | RoomId) {
    return useSelector(selectIsBeingDeleted(roomId))
}
