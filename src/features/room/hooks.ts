import { useSelector } from 'react-redux'
import { PrivacySetting } from '$/types'
import { PrivateRoomOption, PublicRoomOption } from '../../components/modals/AddRoomModal'
import {
    selectEditingRoomName,
    selectGettingStorageNodes,
    selectIsBeingDeleted,
    selectPersistingRoomName,
    selectPrivacy,
    selectPrivacyChanging,
    selectPrivacyGetting,
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

export function usePrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacy(roomId))
}

export function usePrivacyOption(roomId: undefined | RoomId) {
    return usePrivacy(roomId) === PrivacySetting.Private ? PrivateRoomOption : PublicRoomOption
}

export function useGettingPrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacyGetting(roomId))
}

export function useChangingPrivacy(roomId: undefined | RoomId) {
    return useSelector(selectPrivacyChanging(roomId))
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
