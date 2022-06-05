import { OptionalAddress } from '../../types/common'
import { useTickedAt } from '../features/clock/hooks'
import { useNoticedAt } from '../features/member/hooks'
import Minute from '../utils/minute'

const THRESHOLD = Minute

export default function useIsOnline(address: OptionalAddress) {
    const lastSeenAt = useNoticedAt(address)

    const tickedAt = useTickedAt()

    return typeof tickedAt === 'number' ? lastSeenAt > tickedAt - THRESHOLD : false
}
