import { useSelector } from 'react-redux'
import { selectIdenticon, selectRetrievingIdenticon } from './selectors'
import { IdenticonSeed } from './types'

export function useIdenticon(seed: IdenticonSeed) {
    return useSelector(selectIdenticon(seed))
}

export function useRetrievingIdenticon(seed: IdenticonSeed) {
    return useSelector(selectRetrievingIdenticon(seed))
}
