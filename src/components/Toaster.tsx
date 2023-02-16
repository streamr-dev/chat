import { ToasterAction } from '$/features/toaster'
import defer from '$/utils/defer'
import uniqueId from 'lodash/uniqueId'
import { ComponentProps, FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

type ResolveResult<T> = T extends FC<infer R>
    ? R extends { onProceed?: (_: infer K) => void }
        ? K
        : void
    : never

interface HandlerProps<T> {
    onProceed?: (arg: ResolveResult<T>) => void
    onAbort?: () => void
}

type Props<T extends FC> = { abortSignal?: AbortSignal } & HandlerProps<T> &
    Omit<ComponentProps<T>, keyof HandlerProps<any>>

export interface Controller<T extends FC> {
    dismiss: () => void
    open: (props?: Props<T>) => Promise<void>
    update: (props: Props<T>) => void
}

export type ToasterCallback = <T extends FC>(bread: T, props?: Props<T>) => Controller<T>

interface ToastMetadata<T extends FC = FC> {
    id: string
    bread: T
    props: Props<T>
    handlerProps: HandlerProps<T>
}

function forge({
    onAdd,
    onRemove,
    onUpdate,
}: {
    onAdd?: (t: ToastMetadata) => void
    onRemove?: (t: ToastMetadata) => void
    onUpdate?: (t: ToastMetadata) => void
}) {
    let toasts: ToastMetadata[] = []

    function add(t: ToastMetadata) {
        toasts = [...toasts, t]

        onAdd?.(t)
    }

    function remove(t: ToastMetadata) {
        toasts = toasts.filter(({ id }) => id !== t.id)

        onRemove?.(t)
    }

    function update(t: ToastMetadata) {
        toasts = toasts.map((t0) => (t0.id === t.id ? t : t0))

        onUpdate?.(t)
    }

    return <T extends FC>(bread: T, defaultProps?: Props<T>): Controller<T> => {
        let t: ToastMetadata<T> | undefined

        let abortController: AbortController | undefined

        return {
            dismiss() {
                abortController?.abort()

                abortController = undefined
            },
            async open(props) {
                const { onAbort, onProceed, ...rest } = {
                    ...(defaultProps || {}),
                    ...(props || {}),
                }

                const { resolve, reject, promise } = await defer<ResolveResult<T>>()

                abortController = new AbortController()

                const moddedProps: Props<T> = {
                    ...(rest as any),
                    onProceed: resolve,
                    onAbort: reject,
                    abortSignal: abortController.signal,
                    onDiscardable() {
                        if (t) {
                            remove(t)

                            t = undefined
                        }
                    },
                }

                t = {
                    id: uniqueId(),
                    bread,
                    props: moddedProps,
                    handlerProps: {
                        onAbort,
                        onProceed,
                    },
                }

                add(t)

                try {
                    const result = await promise

                    t.handlerProps.onProceed?.(result)

                    return result
                } catch (e) {
                    t.handlerProps.onAbort?.()

                    throw e
                } finally {
                    abortController = undefined
                }
            },
            update(props) {
                if (!t) {
                    return
                }

                const { onAbort, onProceed, ...rest } = props

                t.props = {
                    ...t.props,
                    ...rest,
                }

                if ('onAbort' in props) {
                    t.handlerProps.onAbort = onAbort
                }

                if ('onProceed' in props) {
                    t.handlerProps.onProceed = onProceed
                }

                update(t)
            },
        }
    }
}

export default function Toaster() {
    const [toasts, setToasts] = useState<ToastMetadata[]>([])

    const containerRef = useRef(
        (() => {
            const div = document.createElement('div')

            div.id = uniqueId(`${'Toaster'}-`)

            return div
        })()
    )

    useEffect(() => {
        const { current: div } = containerRef

        document.body.appendChild(div)

        return () => {
            document.body.removeChild(div)
        }
    }, [])

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(
            ToasterAction.set({
                instance: forge({
                    onAdd(t) {
                        setToasts((ts) => [...ts, t])
                    },
                    onRemove(t) {
                        setToasts((ts) => ts.filter(({ id }) => t.id !== id))
                    },
                    onUpdate(t) {
                        setToasts((ts) => ts.map((t0) => (t0.id === t.id ? t : t0)))
                    },
                }),
            })
        )

        return () => {
            dispatch(
                ToasterAction.set({
                    instance: undefined,
                })
            )
        }
    }, [dispatch])

    return createPortal(
        <div
            css={tw`
                fixed
                right-4
                bottom-4
                z-10
            `}
        >
            {toasts.map(({ id, bread: Bread, props }) => (
                <Bread key={id} {...props} />
            ))}
        </div>,
        containerRef.current
    )
}
