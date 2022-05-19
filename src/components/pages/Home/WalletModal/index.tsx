import ReactModal from 'react-modal'
import tw from 'twin.macro'
import noOp from '../../../../utils/noOp'
import adapters from '../../../../utils/web3/adapters'
import WalletOption from './WalletOption'

type Props = {
    open?: boolean
    setOpen?: (state: boolean) => void
}

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
}

export default function WalletModal({ open = false, setOpen = noOp }: Props) {
    return (
        <ReactModal
            isOpen={open}
            contentLabel="Connect a wallet"
            onRequestClose={() => void setOpen(false)}
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
                    Select a wallet
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
                        onClick={() => void setOpen(false)}
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
            {adapters.map((adapter) => (
                <WalletOption key={adapter.id} walletAdapter={adapter} />
            ))}
        </ReactModal>
    )
}
