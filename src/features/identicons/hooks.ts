import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'
import { IdenticonAction } from '$/features/identicons'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIdenticon } from './selectors'
import { IdenticonSeed } from './types'

export function useIdenticon(seed: IdenticonSeed) {
    return useSelector(selectIdenticon(seed))
}

export function useIsRetrievingIdenticon(seed: IdenticonSeed) {
    return useSelector(selectFlag(Flag.isIdenticonBeingRetrieved(seed)))
}

export function useRetrieveIdenticon() {
    const dispatch = useDispatch()

    return useCallback((seed: IdenticonSeed) => {
        dispatch(
            IdenticonAction.retrieve({
                seed,
                fingerprint: Flag.isIdenticonBeingRetrieved(seed),
            })
        )
    }, [])
}
