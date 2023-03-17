import { ForwardedRef, forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import { useRefs } from 'streamr-ui/hooks'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    onWidthOffsetChange?: (value: number) => void
}

const Textarea = forwardRef(
    ({ value, onWidthOffsetChange, ...props }: Props, ref?: ForwardedRef<HTMLTextAreaElement>) => {
        const innerRef = useRef<HTMLTextAreaElement>(null)

        const attach = useRefs(innerRef, ref)

        const onWidthOffsetChangeRef = useRef(onWidthOffsetChange)

        useEffect(() => {
            onWidthOffsetChangeRef.current = onWidthOffsetChange
        }, [onWidthOffsetChange])

        useEffect(() => {
            const { current: t } = innerRef

            if (!t) {
                return
            }

            // Reset the height to the default 3rem to avoid glitching.
            t.style.height = '3rem'

            t.style.height = `${t.scrollHeight}px`

            /**
             * Make sure we take the vertical scrollbar into account and
             * inform the host component about the amount of space it takes.
             */
            onWidthOffsetChangeRef.current?.(t.offsetWidth - t.clientWidth)
        }, [value])

        useEffect(() => {
            function onResize() {
                const { current: t } = innerRef

                if (!t) {
                    return
                }

                /**
                 * Again, inform the host component that there's (or isn't) space
                 * taken by the vertical scrollbar.
                 */
                onWidthOffsetChangeRef.current?.(t.offsetWidth - t.clientWidth)
            }

            window.addEventListener('resize', onResize)

            return () => {
                window.removeEventListener('resize', onResize)
            }
        }, [])

        return <textarea {...props} ref={attach} css={tw`resize-none`} value={value} />
    }
)

export { Textarea as default, Textarea }
