import { useSelector } from 'react-redux'
import { OptionalAddress } from '$/types'
import { selectNoticedAt } from './selectors'

export function useNoticedAt(address: OptionalAddress): number {
    return useSelector(selectNoticedAt(address)) || Number.NEGATIVE_INFINITY
}
