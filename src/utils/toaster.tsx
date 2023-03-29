import EventEmitter from 'eventemitter3'
import uniqueId from 'lodash/uniqueId'
import {
    ComponentProps,
    createContext,
    FC,
    HTMLAttributes,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { createPortal } from 'react-dom'
import defer, { Deferral } from './defer'

export const Reason = {
    Update: Symbol('update'),
    Unmount: Symbol('unmount'),
    Host: Symbol('host'),
}

function eventName(containerId: string) {
    return `toaster:${containerId}`
}

const DiscardableContext = createContext<[() => void, Promise<unknown>]>([
    () => {
        // Do nothing
    },
    Promise.resolve(),
])

export function useDiscardableEffect(fn?: (discard: () => void | Promise<void>) => void) {
    const fnRef = useRef(fn)

    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    const [discard, promise] = useContext(DiscardableContext)

    useEffect(() => {
        async function innerFn() {
            try {
                await promise
            } catch (e) {
                if (e === Reason.Update) {
                    return
                }
            }

            if (fnRef.current) {
                return void fnRef.current(discard)
            }

            discard()
        }

        innerFn()
    }, [discard, promise])
}

interface EntityMetadata<P extends FC = FC<any>> {
    id: string
    props?: ComponentProps<P>
    component: P
    deferral: Deferral<
        SettlerReturnValue<P, 'onResolve'>,
        SettlerReturnValue<P, 'onReject'> | typeof Reason.Update
    >
    discardDeferral: Deferral
}

export const Layer = {
    Modal: 'modals',
    Toast: 'toasts',
}

let emitter: EventEmitter | undefined

const containers: Record<string, true> = {}

function getEmitter(): EventEmitter {
    if (!emitter) {
        emitter = new EventEmitter()
    }

    return emitter
}

export function Container({
    id,
    ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'children'> & { id: string }) {
    const containerRef = useRef<HTMLDivElement>(document.createElement('div'))

    containerRef.current.id = id

    const [metadatas, setMetadatas] = useState<Record<string, EntityMetadata>>({})

    useEffect(() => {
        let mounted = true

        const { current: container } = containerRef

        const { id } = container

        if (Object.prototype.hasOwnProperty.call(containers, id) && containers[id]) {
            throw new Error('Container id already used')
        }

        containers[id] = true

        document.body.appendChild(container)

        let cache: typeof metadatas = {}

        async function onEvent(metadata: EntityMetadata) {
            if (!mounted) {
                return
            }

            setMetadatas((all) => ({
                ...all,
                [metadata.id]: metadata,
            }))

            cache[metadata.id] = metadata

            try {
                await metadata.deferral.promise
            } catch (e) {
                if (e === Reason.Update) {
                    return
                }
            }

            try {
                await metadata.discardDeferral.promise
            } catch (e) {
                // Do nothing.
            }

            if (!mounted) {
                return
            }

            setMetadatas(({ [metadata.id]: omit, ...newMetadatas }) => newMetadatas)

            delete cache[metadata.id]
        }

        const en = eventName(id)

        getEmitter().on(en, onEvent)

        return () => {
            mounted = false

            document.body.removeChild(container)

            getEmitter().off(en, onEvent)

            delete containers[id]

            for (const key in cache) {
                if (!Object.prototype.hasOwnProperty.call(cache, key)) {
                    continue
                }

                cache[key].deferral.reject(Reason.Unmount)

                cache[key].discardDeferral.reject()
            }

            cache = {}
        }
    }, [])

    return createPortal(
        <div {...props}>
            {Object.entries(metadatas).map(
                ([
                    key,
                    {
                        component: C,
                        props: innerProps,
                        deferral: { resolve, reject, promise },
                        discardDeferral: { resolve: discard },
                    },
                ]) => {
                    const {
                        onResolve: omit0,
                        onReject: omit1,
                        onDiscard: omit2,
                        ...rest
                    } = (innerProps || {}) as any

                    return (
                        <DiscardableContext.Provider key={key} value={[discard, promise]}>
                            <C {...rest} onResolve={resolve} onReject={reject} />
                        </DiscardableContext.Provider>
                    )
                }
            )}
        </div>,
        containerRef.current
    )
}

export type SettlerReturnValue<
    T extends FC,
    K extends 'onResolve' | 'onReject'
> = ComponentProps<T> extends Partial<Record<K, (value: infer R) => void>> ? R : void

export interface Toaster<T extends FC<any>> {
    pop: (props?: ComponentProps<T>) => Promise<SettlerReturnValue<T, 'onResolve'>>
    discard: () => void
}

export function toaster<T extends FC<any>>(component: T, id: string): Toaster<T> {
    let metadata: EntityMetadata<T> | undefined

    return {
        async pop(props) {
            if (metadata) {
                try {
                    metadata.deferral.reject(Reason.Update)

                    await metadata.deferral.promise
                } catch (e) {
                    // Do nothing.
                }
            }

            metadata = {
                id: metadata?.id || uniqueId(),
                props,
                component,
                deferral: defer(),
                discardDeferral: defer(),
            }

            getEmitter().emit(eventName(id), metadata)

            let reset = false

            try {
                const result = (await metadata.deferral.promise) as SettlerReturnValue<
                    T,
                    'onResolve'
                >

                props?.onResolve?.(result)

                reset = true

                return result
            } catch (e) {
                props?.onReject?.(e)

                reset = e !== Reason.Update

                throw e
            } finally {
                if (reset) {
                    metadata = undefined
                }
            }
        },
        discard() {
            metadata?.deferral.reject(Reason.Host)
        },
    }
}
