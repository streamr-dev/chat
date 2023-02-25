import {
    PrivateRoomOption,
    PublicRoomOption,
    TokenGatedRoomOption,
} from '$/components/PrivacySelectField'
import { RoomId } from '$/features/room/types'
import usePrivacy from '$/hooks/usePrivacy'
import { PrivacySetting } from '$/types'

export default function usePrivacyOption(roomId: undefined | RoomId) {
    const privacy = usePrivacy(roomId)

    switch (privacy) {
        case PrivacySetting.Public:
            return PublicRoomOption
        case PrivacySetting.TokenGated:
            return TokenGatedRoomOption
        case PrivacySetting.Private:
        default:
            return PrivateRoomOption
    }
}
