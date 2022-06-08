import { OptionalAddress } from '../../types/common'
import { useTickedAt } from '../features/clock/hooks'
import { useNoticedAt } from '../features/member/hooks'
import formatDate from '../utils/formatDate'

export default function useSeenAgo(address: OptionalAddress) {
    const lastSeenAt = useNoticedAt(address)

    const tickedAt = useTickedAt()

    if (!tickedAt || lastSeenAt < 0) {
        return 'never'
    }

    const secondsSince = Math.floor((tickedAt - lastSeenAt) / 1000)

    if (secondsSince < 15) {
        return 'just now'
    }

    if (secondsSince < 60) {
        return 'less then a minute ago'
    }

    if (secondsSince < 120) {
        return 'a minute ago'
    }

    if (secondsSince < 300) {
        return 'a couple of minutes ago'
    }

    if (secondsSince < 900) {
        return 'within the last 15 minutes'
    }

    if (secondsSince > 900 && secondsSince < 3600) {
        return 'within the last hour'
    }

    return formatDate(lastSeenAt)
}
