import { selectFlag } from '$/features/flag/selectors'
import { useSelector } from 'react-redux'

export default function useFlag(flag: undefined | string) {
    return useSelector(selectFlag(flag))
}
