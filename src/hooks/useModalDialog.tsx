import defer from '$/utils/defer'
import React, {
    ComponentProps,
    FC,
    HTMLAttributes,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import { createPortal } from 'react-dom'
import uniqueId from 'lodash/uniqueId'
import tw from 'twin.macro'
import useGlobalKeyDownEffect from 'streamr-ui/hooks/useGlobalKeyDownEffect'

type ResolveResult<T> = T extends FC<infer R>
    ? R extends { onProceed?: (_: infer K) => void }
        ? K
        : void
    : never

type Props<T extends FC> = {
    onProceed?: (arg?: ResolveResult<T>) => void
    onAbort?: () => void
} & ComponentProps<T>

function createDiv(name: undefined | string) {
    const div = document.createElement('div')

    div.id = uniqueId(`${name || 'ModalDialog'}-`)

    return div
}

export default function useModalDialog<T extends FC, P extends Props<T>>(
    component: T,
    defaultProps?: P
) {
    const divRef = useRef(createDiv(component.displayName))

    useEffect(() => {
        const { current: div } = divRef

        document.body.appendChild(div)

        return () => {
            document.body.removeChild(div)
        }
    }, [])

    const defaultPropsRef = useRef(defaultProps)

    useEffect(() => {
        defaultPropsRef.current = defaultProps
    }, [defaultProps])

    const deferRef = useRef<any>()

    const [isOpen, setIsOpen] = useState(false)

    const [props, setProps] = useState<P>({
        ...((defaultProps as any) || {}),
        onProceed(arg) {
            deferRef.current?.resolve(arg)
        },
        onAbort() {
            deferRef.current?.reject()
        },
    })

    const open = useCallback(async (newProps?: P) => {
        if (deferRef.current) {
            throw new Error('Modal already open')
        }

        const { onProceed, onAbort, ...rest } = {
            ...defaultPropsRef.current,
            ...(newProps || {}),
        }

        setProps((c) => ({
            ...c,
            ...rest,
        }))

        setIsOpen(true)

        const d = await defer()

        deferRef.current = d

        try {
            const result = (await d.promise) as ResolveResult<T>

            onProceed?.(result)

            return result
        } catch (e) {
            onAbort?.()

            throw e
        } finally {
            deferRef.current = undefined
            setIsOpen(false)
        }
    }, [])

    const close = useCallback(() => {
        if (!deferRef.current) {
            return
        }

        deferRef.current.reject()
    }, [])

    const toggle = useCallback((open?: boolean) => {
        if (!deferRef.current) {
            return
        }

        if (typeof open === 'undefined') {
            return void setIsOpen((c) => !c)
        }

        setIsOpen(open)
    }, [])

    const C: any = component

    useEffect(
        () => () => {
            deferRef.current?.reject()
        },
        []
    )

    useGlobalKeyDownEffect((e) => {
        if (e.key === 'Escape' && isOpen) {
            close()
        }
    })

    return {
        open,
        close,
        toggle,
        modal: isOpen
            ? createPortal(
                  <>
                      <Backdrop onMouseDown={() => void close()} />
                      <C {...props} />
                  </>,
                  divRef.current
              )
            : null,
    }
}

function Backdrop(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={[
                tw`
                    bg-[rgba(0, 0, 0, 0.3)]
                    backdrop-blur
                    fixed
                    top-0
                    left-0
                    w-full
                    h-full
                `,
            ]}
        />
    )
}
