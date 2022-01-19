import { useCallback } from "react"
import { ActionType, useDispatch, useStore } from "../components/Store"
import { MetamaskDelegatedAccess } from "../lib/MetamaskDelegatedAccess"

export default function useConnect(): () => Promise<void> {
    const { ethereumProvider } = useStore()

    const dispatch = useDispatch()

    return useCallback(async () => {
        const payload = await (new MetamaskDelegatedAccess(ethereumProvider!)).connect()

        dispatch({
            type: ActionType.SetSession,
            payload,
        })
    }, [ethereumProvider, dispatch])
}
