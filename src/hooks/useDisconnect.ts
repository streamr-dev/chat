import { useCallback } from 'react'
import { ActionType, useDispatch } from '../components/Store'

export default function useDisconnect() {
    const dispatch = useDispatch()

    return useCallback(() => {
        localStorage.clear()

        dispatch({
            type: ActionType.Reset,
        })
    }, [dispatch])
}
