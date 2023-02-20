import { State } from '$/types'
import { useSelector } from 'react-redux'

export function selectAvatar(ens: undefined | null | string) {
    if (!ens) {
        return () => undefined
    }

    return (state: State) => state.avatar.urls[ens]
}

export default function useAvatar(ens: string | null | undefined) {
    return useSelector(selectAvatar(ens))
}
