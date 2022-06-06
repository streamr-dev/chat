import { useSelector } from 'react-redux'
import {
    selectGettingStorageNodes,
    selectPrivacy,
    selectPrivacyChanging,
    selectPrivacyGetting,
    selectSelectedRoomId,
    selectStorageNodeState,
    selectStorageNodeToggling,
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

export function usePrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacy(roomId))
}

export function useGettingPrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacyGetting(roomId))
}

export function useChangingPrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacyChanging(roomId))
}
