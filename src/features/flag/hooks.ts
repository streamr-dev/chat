import { selectFlag } from '$/features/flag/selectors'
import { useSelector } from 'react-redux'

export function useIsFlagSet(key: string): boolean {
    return useSelector(selectFlag(key))
}
