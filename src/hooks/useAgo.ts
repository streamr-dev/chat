import { useEffect, useRef, useState } from 'react'

export default function useAgo(timestamp: undefined | number): undefined | string {
    const [delta, setDelta] = useState<undefined | string>()

    const timeoutRef = useRef<undefined | number>()

    useEffect(() => {
        let mounted = true

        function teardown() {
            if (typeof timeoutRef.current === 'number') {
                window.clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = undefined

            mounted = false
        }

        function tick() {
            if (!mounted || typeof timestamp !== 'number') {
                return
            }

            const ss = (Date.now() - timestamp) / 1000 // seconds since timestamp

            switch (true) {
                case ss < 60:
                    setDelta('now')
                    break
                case ss < 3600:
                    setDelta(`${Math.floor(ss / 60)}m`)
                    break
                case ss < 86400:
                    setDelta(`${Math.floor(ss / 3600)}h`)
                    break
                default:
                    setDelta(`${Math.floor(ss / 86400)}d`)
                    break
            }

            timeoutRef.current = window.setTimeout(tick, 1000)
        }

        tick()

        return teardown
    }, [timestamp])

    return delta
}
