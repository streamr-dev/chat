import Avatar from '$/components/Avatar'
import useTokenInfo from '$/hooks/useTokenInfo'
import { OptionalAddress } from '$/types'
import tw from 'twin.macro'

export default function TokenLogo({ tokenAddress }: { tokenAddress: OptionalAddress }) {
    const info = useTokenInfo(tokenAddress)

    return info && 'symbol' in info ? (
        <img
            src={`https://polygonscan.com/token/images/${info.logo}`}
            alt={info.symbol}
            width="32"
            height="32"
        />
    ) : (
        <Avatar
            seed={tokenAddress?.toLowerCase()}
            css={tw`
                w-8
                h-8
            `}
        />
    )
}
