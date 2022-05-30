import { useSelector } from 'react-redux'
import { selectDelegatedClient } from './selectors'

export function useDelegatedClient() {
    return useSelector(selectDelegatedClient)
}
