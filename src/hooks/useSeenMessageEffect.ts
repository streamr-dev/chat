import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { IMessage } from '$/features/message/types'
import { RoomId } from '$/features/room/types'
import { OptionalAddress } from '$/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const Delay = 2000

export default function useSeenMessageEffect(
    element: null | HTMLDivElement,
    messageId: IMessage['id'],
    roomId: RoomId,
    requester: OptionalAddress,
    { skip = false } = {}
) {
    const dispatch = useDispatch()

    const [isWindowVisible, setIsWindowVisible] = useState<boolean>(!document.hidden)

    const [isWindowFocused, setIsWindowFocused] = useState<boolean>(document.hasFocus())

    useEffect(() => {
        let mounted = true

        function onVisibilityChange() {
            if (mounted) {
                setIsWindowVisible(!document.hidden)
            }
        }

        function onFocus() {
            if (mounted) {
                setIsWindowFocused(true)
            }
        }

        function onBlur() {
            if (mounted) {
                setIsWindowFocused(false)
            }
        }

        window.addEventListener('focus', onFocus)

        window.addEventListener('blur', onBlur)

        document.addEventListener('visibilitychange', onVisibilityChange)

        return () => {
            mounted = false

            document.removeEventListener('visibilitychange', onVisibilityChange)

            window.removeEventListener('blur', onBlur)

            window.removeEventListener('focus', onFocus)
        }
    }, [])

    useEffect(() => {
        let mounted = true

        if (!element || !requester || skip || !isWindowFocused || !isWindowVisible) {
            return
        }

        let timeoutId: undefined | number

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(({ target, isIntersecting }) => {
                if (target !== element) {
                    throw new Error('Unexpected target')
                }

                if (timeoutId) {
                    clearTimeout(timeoutId)
                }

                timeoutId = undefined

                if (!mounted || !isIntersecting) {
                    return
                }

                timeoutId = window.setTimeout(() => {
                    if (!mounted || !requester) {
                        return
                    }

                    dispatch(
                        MessageAction.updateSeenAt({
                            roomId,
                            requester,
                            id: messageId,
                            seenAt: Date.now(),
                            fingerprint: Flag.isSeenAtBeingUpdated(roomId, requester, messageId),
                        })
                    )
                }, Delay)
            })
        })

        observer.observe(element)

        return () => {
            mounted = false

            observer.disconnect()
        }
    }, [element, messageId, roomId, requester, skip, isWindowFocused, isWindowVisible])
}
