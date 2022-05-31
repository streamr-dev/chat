import { useSelector } from 'react-redux'
import { selectTickedAt } from './selectors'

export function useTickedAt() {
    return useSelector(selectTickedAt)
}
