import { RoomId } from '$/features/room/types'
import { PrivacySetting, State } from '$/types'
import { useSelector } from 'react-redux'

type Result<T> = T extends PrivacySetting ? PrivacySetting : PrivacySetting | undefined

function selectPrivacy<T>(roomId: undefined | RoomId, fallbackSetting?: T) {
    return (state: State) =>
        ((roomId ? state.room.cache[roomId]?.privacy : undefined) || fallbackSetting) as Result<T>
}

export default function usePrivacy<T>(roomId: undefined | RoomId, fallbackSetting?: T) {
    return useSelector(selectPrivacy(roomId, fallbackSetting)) as Result<T>
}
