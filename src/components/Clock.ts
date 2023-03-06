import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { ClockAction } from '$/features/clock'

// @TODO: Move to a saga.
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
            dispatch(ClockAction.tick(Date.now()))

            timeoutRef.current = window.setTimeout(onTimeout, 5000)
        }

        onTimeout()

        return () => {
            teardown()
        }
    }, [])

    return null
}
