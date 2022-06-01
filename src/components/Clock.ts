import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { tick } from '../features/clock/actions'
import Minute from '../utils/minute'

export default function Clock() {
    const dispatch = useDispatch()

    const timeoutRef = useRef<undefined | number>()

    useEffect(() => {
        function teardown() {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = undefined
            }
        }

        teardown()

        function onTimeout() {
            dispatch(tick(Date.now()))

            timeoutRef.current = window.setTimeout(onTimeout, Minute)
        }

        onTimeout()

        return () => {
            teardown()
        }
    }, [])

    return null
}
