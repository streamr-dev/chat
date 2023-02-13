import Text from '$/components/Text'
import MetaMaskIcon from '$/icons/MetaMaskIcon'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    onWhite?: boolean
}

export default function TryMetaMask({ onWhite = false, ...props }: Props) {
    return (
        <div {...props} css={tw`flex`}>
            Need a wallet? Try{' '}
            <a
                href="https://metamask.io/"
                rel="noreferrer noopener"
                target="_blank"
                css={[
                    tw`
                        rounded-full
                        flex
                        items-center
                        ml-1
                        px-2
                        py-0.5
                    `,
                    onWhite
                        ? tw`
                            bg-[#F1F4F7]
                        `
                        : tw`
                            bg-white
                            bg-opacity-40
                        `,
                ]}
            >
                <MetaMaskIcon
                    css={tw`
                        w-4
                        h-4
                        mr-1
                    `}
                />{' '}
                <Text>MetaMask</Text>
            </a>
        </div>
    )
}
