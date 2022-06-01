import { OptionalAddress } from '../../types/common'
import { useTickedAt } from '../features/clock/hooks'
import { useLastSeenAt } from '../features/members/hooks'
import Minute from '../utils/minute'

const THRESHOLD = 5 * Minute

export default function useIsOnline(address: OptionalAddress) {
    const lastSeenAt = useLastSeenAt(address)

    const tickedAt = useTickedAt()

    return typeof tickedAt === 'number' ? lastSeenAt > tickedAt - THRESHOLD : false
}
