import { ReactNode } from 'react'
import ReactModal from 'react-modal'
import tw from 'twin.macro'

export type ModalProps = {
    open?: boolean
    setOpen?: (state: boolean) => void
}

type Props = ModalProps & {
    children?: ReactNode
    title: string
    onClose?: () => void
}

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
}

export default function Modal({
    open = false,
    setOpen,
    children,
    title,
    onClose,
}: Props) {
    function close() {
        if (typeof setOpen !== 'function') {
            return
        }

        setOpen(false)

        if (typeof onClose === 'function') {
            onClose()
        }
    }

    return (
        <ReactModal
            isOpen={open}
            onRequestClose={close}
            appElement={document.getElementById('root') as HTMLElement}
            style={customStyles}
            css={[
                tw`
                    -translate-x-1/2
                    -translate-y-1/2
                    absolute
                    bg-[white]
                    left-1/2
                    max-w-[528px]
                    p-12
                    pt-8
                    rounded-[20px]
                    shadow-lg
                    top-1/2
                    w-[90vw]
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex
                        items-center
                        mb-6
                        font-medium
                    `,
                ]}
            >
                <h2
                    css={[
                        tw`
                            flex-grow
                            text-[1.25rem]
                        `,
                    ]}
                >
                    {title}
                </h2>
                <div>
                    <button
                        type="button"
                        css={[
                            tw`
                                block
                                appearance-none
                                [svg]:block
                            `,
                        ]}
                        onClick={close}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.47 8.47a.75.75 0 0 1 1.06 0L16 14.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L17.06 16l6.47 6.47a.75.75 0 1 1-1.06 1.06L16 17.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L14.94 16 8.47 9.53a.75.75 0 0 1 0-1.06z"
                                fill="#59799C"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {children}
        </ReactModal>
    )
}
