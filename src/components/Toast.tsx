import Dot from '$/components/Dot'
import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import {
    ButtonHTMLAttributes,
    FC,
    HTMLAttributes,
    ReactNode,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
} from 'react'
import tw, { css } from 'twin.macro'

export enum ToastType {
    Error,
    Info,
    None,
    Processing,
    Success,
    Warning,
}

const Shape: Partial<Record<ToastType, FC>> = {
    [ToastType.Error]: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.76636 0.982748C10.0093 1.08342 10.2301 1.23098 10.416 1.417L16.584 7.584C16.7701 7.76993 16.9178 7.99074 17.0186 8.2338C17.1194 8.47685 17.1712 8.73738 17.1712 9.0005C17.1712 9.26361 17.1194 9.52415 17.0186 9.7672C16.9178 10.0103 16.7701 10.2311 16.584 10.417L10.416 16.584C10.2301 16.77 10.0093 16.9176 9.76636 17.0182C9.52339 17.1189 9.26298 17.1707 8.99998 17.1707C8.73699 17.1707 8.47657 17.1189 8.2336 17.0182C7.99064 16.9176 7.7699 16.77 7.58398 16.584L1.41598 10.417C1.22982 10.2311 1.08213 10.0103 0.981365 9.7672C0.8806 9.52415 0.828735 9.26361 0.828735 9.0005C0.828735 8.73738 0.8806 8.47685 0.981365 8.2338C1.08213 7.99074 1.22982 7.76993 1.41598 7.584L7.58398 1.417C7.7699 1.23098 7.99064 1.08342 8.2336 0.982748C8.47657 0.882072 8.73699 0.830254 8.99998 0.830254C9.26298 0.830254 9.52339 0.882072 9.76636 0.982748ZM8.29287 10.7071C8.48041 10.8946 8.73476 11 8.99998 11C9.26519 11 9.51955 10.8946 9.70708 10.7071C9.89462 10.5196 9.99998 10.2652 9.99998 9.99999V4.99999C9.99998 4.73478 9.89462 4.48042 9.70708 4.29289C9.51955 4.10535 9.26519 3.99999 8.99998 3.99999C8.73476 3.99999 8.48041 4.10535 8.29287 4.29289C8.10533 4.48042 7.99998 4.73478 7.99998 4.99999V9.99999C7.99998 10.2652 8.10533 10.5196 8.29287 10.7071ZM8.29287 13.7071C8.48041 13.8946 8.73476 14 8.99998 14C9.26519 14 9.51955 13.8946 9.70708 13.7071C9.89462 13.5196 9.99998 13.2652 9.99998 13C9.99998 12.7348 9.89462 12.4804 9.70708 12.2929C9.51955 12.1053 9.26519 12 8.99998 12C8.73476 12 8.48041 12.1053 8.29287 12.2929C8.10533 12.4804 7.99998 12.7348 7.99998 13C7.99998 13.2652 8.10533 13.5196 8.29287 13.7071Z"
                fill="#FF5630"
            />
        </svg>
    ),
    [ToastType.Info]: () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM11 6C11 6.55228 10.5523 7 10 7C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5C10.5523 5 11 5.44772 11 6ZM10 8C10.5523 8 11 8.44771 11 9V14C11 14.5523 10.5523 15 10 15C9.44771 15 9 14.5523 9 14V9C9 8.44771 9.44771 8 10 8Z"
                fill="#6554C0"
            />
        </svg>
    ),
    [ToastType.Success]: () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM7.3824 9.06892C7.50441 9.12133 7.61475 9.19751 7.707 9.29302L9 10.586L12.293 7.29302C12.3852 7.19751 12.4956 7.12133 12.6176 7.06892C12.7396 7.01651 12.8708 6.98892 13.0036 6.98777C13.1364 6.98662 13.2681 7.01192 13.391 7.0622C13.5138 7.11248 13.6255 7.18673 13.7194 7.28063C13.8133 7.37452 13.8875 7.48617 13.9378 7.60907C13.9881 7.73196 14.0134 7.86364 14.0122 7.99642C14.0111 8.1292 13.9835 8.26042 13.9311 8.38243C13.8787 8.50443 13.8025 8.61477 13.707 8.70702L9.707 12.707C9.51947 12.8945 9.26516 12.9998 9 12.9998C8.73483 12.9998 8.48053 12.8945 8.293 12.707L6.293 10.707C6.19749 10.6148 6.1213 10.5044 6.0689 10.3824C6.01649 10.2604 5.9889 10.1292 5.98775 9.99642C5.98659 9.86364 6.0119 9.73196 6.06218 9.60907C6.11246 9.48617 6.18671 9.37452 6.2806 9.28063C6.3745 9.18673 6.48615 9.11248 6.60904 9.0622C6.73194 9.01192 6.86362 8.98662 6.9964 8.98777C7.12918 8.98892 7.2604 9.01651 7.3824 9.06892Z"
                fill="#36B37E"
            />
        </svg>
    ),
    [ToastType.Warning]: () => (
        <svg
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.31 1.343L17.669 14.513C17.7539 14.6652 17.7975 14.8369 17.7955 15.0111C17.7936 15.1853 17.7462 15.356 17.658 15.5063C17.5698 15.6565 17.4438 15.7811 17.2926 15.8677C17.1414 15.9543 16.9702 15.9999 16.796 16H1.20401C1.02963 16 0.858278 15.9544 0.70695 15.8678C0.555623 15.7811 0.429584 15.6564 0.341343 15.506C0.253101 15.3556 0.205723 15.1848 0.203911 15.0104C0.2021 14.836 0.245916 14.6642 0.331014 14.512L7.69101 1.343C7.82126 1.11023 8.01121 0.916412 8.2413 0.781501C8.47139 0.64659 8.73329 0.57547 9.00001 0.57547C9.26674 0.57547 9.52864 0.64659 9.75873 0.781501C9.98881 0.916412 10.1788 1.11023 10.309 1.343H10.31ZM9.00001 4.5C8.84423 4.49998 8.69025 4.53333 8.54844 4.5978C8.40662 4.66227 8.28026 4.75636 8.17784 4.87374C8.07543 4.99113 7.99934 5.12908 7.95469 5.27833C7.91005 5.42758 7.89788 5.58465 7.91901 5.739L8.43201 9.505C8.45032 9.64267 8.51801 9.76901 8.62249 9.86051C8.72697 9.95202 8.86113 10.0025 9.00001 10.0025C9.1389 10.0025 9.27306 9.95202 9.37754 9.86051C9.48202 9.76901 9.54971 9.64267 9.56801 9.505L10.081 5.739C10.1021 5.58465 10.09 5.42758 10.0453 5.27833C10.0007 5.12908 9.9246 4.99113 9.82219 4.87374C9.71977 4.75636 9.5934 4.66227 9.45159 4.5978C9.30977 4.53333 9.1558 4.49998 9.00001 4.5ZM9.00001 13.13C9.29838 13.13 9.58453 13.0115 9.79551 12.8005C10.0065 12.5895 10.125 12.3034 10.125 12.005C10.125 11.7066 10.0065 11.4205 9.79551 11.2095C9.58453 10.9985 9.29838 10.88 9.00001 10.88C8.70164 10.88 8.4155 10.9985 8.20452 11.2095C7.99354 11.4205 7.87501 11.7066 7.87501 12.005C7.87501 12.3034 7.99354 12.5895 8.20452 12.8005C8.4155 13.0115 8.70164 13.13 9.00001 13.13Z"
                fill="#FFAB00"
            />
        </svg>
    ),
    [ToastType.Processing]: () => <Spinner strokeColor="#4C9AFF" gap={0.25} />,
}

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
    type?: ToastType
    onProceed?: () => void
    onAbort?: () => void
    onDiscardable?: () => void
    autoCloseAfter?: number | boolean
    title?: ReactNode
    desc?: ReactNode
    okLabel?: string
    cancelLabel?: string
    abortSignal?: AbortSignal
}

const defaultAutoCloseAfter = 3

export default function Toast({
    type = ToastType.None,
    autoCloseAfter: autoCloseAfterProp = true,
    onAbort,
    onProceed,
    onDiscardable,
    title = 'Toast',
    desc,
    okLabel,
    cancelLabel,
    abortSignal,
    ...props
}: Props) {
    const Icon = Shape[type] || (() => null)

    const [shown, hide] = useReducer(() => false, true)

    const [squeezed, squeeze] = useReducer(() => true, false)

    const [height, setHeight] = useState(0)

    const ref = useRef<HTMLDivElement>(null)

    const innerRef = useRef<HTMLDivElement>(null)

    const onDiscardableRef = useRef(onDiscardable)

    useEffect(() => {
        if (!abortSignal) {
            return () => {
                // Noop
            }
        }

        function abort() {
            onAbort?.()

            hide()
        }

        if (abortSignal.aborted) {
            abort()

            return () => {
                // Do nothing
            }
        }

        abortSignal.addEventListener('abort', abort)

        return () => {
            abortSignal.removeEventListener('abort', abort)
        }
    }, [abortSignal, onAbort])

    useEffect(() => {
        onDiscardableRef.current = onDiscardable
    }, [onDiscardable])

    useEffect(() => {
        const { current: root } = ref

        if (!root) {
            return () => {
                // Noop
            }
        }

        function onAnimationEnd({ animationName }: AnimationEvent) {
            if (animationName === 'toastOut') {
                squeeze()
            }

            if (animationName === 'toastSqueeze') {
                onDiscardableRef.current?.()
            }
        }

        root.addEventListener('animationend', onAnimationEnd)

        return () => {
            root.removeEventListener('animationend', onAnimationEnd)
        }
    }, [onDiscardable])

    const autoCloseAfter =
        type !== ToastType.Processing && okLabel == null && cancelLabel == null
            ? autoCloseAfterProp === true
                ? defaultAutoCloseAfter
                : autoCloseAfterProp
            : false

    useEffect(() => {
        if (autoCloseAfter === false) {
            return () => {
                // Do nothing
            }
        }

        const timeoutId = setTimeout(() => {
            onAbort?.()

            hide()
        }, autoCloseAfter * 1000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [autoCloseAfter, onAbort])

    useLayoutEffect(() => {
        const { current: root } = innerRef

        if (!root) {
            return
        }

        const { height } = root.getBoundingClientRect()

        setHeight(height)
    }, [title, desc, okLabel, cancelLabel])

    return (
        <div
            ref={ref}
            style={{
                height: `${height}px`,
            }}
            css={[
                css`
                    transition: 200ms height;
                `,
                tw`
                    mt-2
                    md:mt-3
                    pr-3
                    md:pr-6
                `,
                shown
                    ? tw`
                        animate-[0.15s 1 toastIn both ease-in]
                    `
                    : squeezed
                    ? tw`
                        animate-[0.15s 1 toastSqueeze forwards ease-in]
                    `
                    : tw`
                        animate-[0.15s 1 toastOut forwards ease-in]
                    `,
            ]}
        >
            <div
                ref={innerRef}
                css={[
                    css`
                        box-shadow: 0 0 1px rgba(9, 30, 66, 0.15), 0 4px 4px rgba(9, 30, 66, 0.08);
                    `,
                    tw`
                        px-4
                        py-5
                        bg-white
                        rounded-xl
                        font-karelia
                        flex
                        items-start
                        w-[400px]
                        max-w-full
                    `,
                ]}
            >
                {/* Icon */}
                <div
                    css={tw`
                        w-6
                        h-6
                        relative
                        flex
                        items-center
                        justify-center
                        shrink-0
                        mr-4
                    `}
                >
                    <Icon />
                </div>
                {/* Body. */}
                <div
                    {...props}
                    css={tw`
                        grow
                        min-w-0
                        pt-0.5
                        [h4]:(text-[14px] font-medium text-[#42526E] leading-5 break-words)
                        [p, ul, ol]:(text-[14px] text-[#59799C] leading-5 mt-1 break-words)
                        [ol]:list-inside
                    `}
                >
                    <h4>{title}</h4>
                    {typeof desc === 'string' ? <p>{desc}</p> : desc}
                    {(okLabel || cancelLabel) != null && (
                        <div
                            css={tw`
                                mt-1
                                flex
                                items-center
                            `}
                        >
                            {okLabel != null && (
                                <Button
                                    onClick={() => {
                                        onProceed?.()

                                        hide()
                                    }}
                                >
                                    <Text>{okLabel}</Text>
                                </Button>
                            )}
                            {okLabel != null && cancelLabel != null && (
                                <Dot size={3} css={tw`mx-2`} />
                            )}
                            {cancelLabel != null && (
                                <Button
                                    onClick={() => {
                                        onAbort?.()

                                        hide()
                                    }}
                                >
                                    <Text>{cancelLabel}</Text>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {type !== ToastType.Processing && (
                    <>
                        {/* Close button */}
                        <button
                            onClick={() => {
                                onAbort?.()

                                hide()
                            }}
                            type="button"
                            css={tw`
                                appearance-none
                                shrink-0
                                flex
                                items-center
                                justify-center
                                w-6
                                h-6
                                text-[#59799C]
                                ml-4
                            `}
                        >
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 4.05733L1.47133 0.52866C1.3456 0.407221 1.17719 0.340025 1.0024 0.341544C0.827598 0.343063 0.66039 0.413175 0.536785 0.536781C0.413179 0.660386 0.343066 0.827594 0.341547 1.00239C0.340028 1.17719 0.407225 1.34559 0.528664 1.47133L4.05733 4.99999L0.528664 8.52866C0.407225 8.65439 0.340028 8.8228 0.341547 8.99759C0.343066 9.17239 0.413179 9.3396 0.536785 9.46321C0.66039 9.58681 0.827598 9.65692 1.0024 9.65844C1.17719 9.65996 1.3456 9.59277 1.47133 9.47133L5 5.94266L8.52866 9.47133C8.6544 9.59277 8.8228 9.65996 8.9976 9.65844C9.1724 9.65692 9.3396 9.58681 9.46321 9.46321C9.58681 9.3396 9.65693 9.17239 9.65845 8.99759C9.65997 8.8228 9.59277 8.65439 9.47133 8.52866L5.94266 4.99999L9.47133 1.47133C9.535 1.40983 9.58579 1.33627 9.62073 1.25493C9.65567 1.17359 9.67406 1.08611 9.67483 0.997594C9.6756 0.909074 9.65873 0.821288 9.62521 0.739357C9.59169 0.657426 9.54219 0.582991 9.47959 0.520396C9.417 0.457801 9.34256 0.408299 9.26063 0.374778C9.1787 0.341258 9.09092 0.32439 9.0024 0.325159C8.91388 0.325929 8.8264 0.34432 8.74506 0.379259C8.66372 0.414198 8.59016 0.464986 8.52866 0.52866L5 4.05733Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

function Button({ type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            css={tw`
                block
                text-[14px]
                font-semibold
                text-[#59799C]
                hover:text-[#42526E]
            `}
        />
    )
}
