import { selectFlag } from '$/features/flag/selectors'
import { IdenticonAction } from '$/features/identicons'
import formatFingerprint from '$/utils/formatFingerprint'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIdenticon } from './selectors'
import { IdenticonSeed } from './types'

export function useIdenticon(seed: IdenticonSeed) {
    return useSelector(selectIdenticon(seed))
}

function retrieveFingerprint(seed: IdenticonSeed) {
    return formatFingerprint(IdenticonAction.retrieve.toString(), seed)
}

export function useIsRetrievingIdenticon(seed: IdenticonSeed) {
    return useSelector(selectFlag(retrieveFingerprint(seed)))
}

export function useRetrieveIdenticon() {
    const dispatch = useDispatch()

    return useCallback((seed: IdenticonSeed) => {
        dispatch(
            IdenticonAction.retrieve({
                seed,
                fingerprint: retrieveFingerprint(seed),
            })
        )
    }, [])
}
