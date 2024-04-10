import { PrivacySetting } from '$/types'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { Stream, StreamPermission } from '@streamr/sdk'

export default async function fetchPrivacy(stream: Stream) {
    if (getRoomMetadata(stream).tokenAddress) {
        return PrivacySetting.TokenGated
    }

    const canEveryoneSee: boolean = await stream.hasPermission({
        public: true,
        permission: StreamPermission.SUBSCRIBE,
    })

    return canEveryoneSee ? PrivacySetting.Public : PrivacySetting.Private
}
