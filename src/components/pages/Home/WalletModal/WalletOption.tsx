import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { WalletAdapter } from '../../../../../types/common'
import { setWalletAdapterId } from '../../../../features/session'

type Props = {
    walletAdapter: WalletAdapter
}

export default function WalletOption({ walletAdapter }: Props) {
    const [adapter] = walletAdapter.getConnector()

    const { icon: Icon } = walletAdapter

    const dispatch = useDispatch()

    async function connect() {
        dispatch(setWalletAdapterId(walletAdapter.id))

        try {
            await adapter.activate()
        } catch (e) {
            console.warn('#connect', e)
        }
    }

    return (
        <button
            onClick={connect}
            type="button"
            css={[
                tw`
                    bg-[#F1F4F7]
                    flex
                    h-24
                    items-center
                    px-8
                    rounded
                    rounded-lg
                    text-left
                    w-full
                    transition-colors
                    hover:bg-[#dfe3e8]
                    active:bg-[#d0d4d9]
                    [svg]:block
                    [svg]:h-8
                    [svg]:w-8
                    [& + &]:mt-4
                `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex-grow
                    `,
                ]}
            >
                {walletAdapter.label}
            </div>
            <div>
                <Icon />
            </div>
        </button>
    )
}
