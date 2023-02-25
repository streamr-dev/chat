import {
    PrivateRoomOption,
    PublicRoomOption,
    TokenGatedRoomOption,
} from '$/components/PrivacySelectField'
import { RoomId } from '$/features/room/types'
import usePrivacy from '$/hooks/usePrivacy'
import { PrivacyOption, PrivacySetting } from '$/types'

type Result<T> = T extends PrivacyOption ? PrivacyOption : PrivacyOption | undefined

export default function usePrivacyOption<T>(
    roomId: undefined | RoomId,
    fallbackPrivacyOption?: T
): Result<T> {
    const privacy = usePrivacy(roomId)

    switch (privacy) {
        case PrivacySetting.Public:
            return PublicRoomOption
        case PrivacySetting.TokenGated:
            return TokenGatedRoomOption
        case PrivacySetting.Private:
            return PrivateRoomOption
        default:
            return fallbackPrivacyOption as Result<T>
    }
}
