import Text from '$/components/Text'
import TokenLabel from '$/components/TokenLabel'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import useTokenStandard from '$/hooks/useTokenStandard'
import { OptionalAddress } from '$/types'
import i18n from '$/utils/i18n'
import { HTMLAttributes } from 'react'
import { useDispatch } from 'react-redux'

interface Props extends HTMLAttributes<HTMLDivElement> {
    tokenAddress: OptionalAddress
}

export default function TokenStandardLabel({ tokenAddress, ...props }: Props) {
    const dispatch = useDispatch()

    const tokenStandard = useTokenStandard(tokenAddress)

    if (!tokenAddress || !tokenStandard) {
        return null
    }

    return (
        <div {...props}>
            {tokenStandard === TokenStandard.Unknown ? (
                <TokenLabel
                    as="button"
                    onClick={() => {
                        dispatch(
                            MiscAction.setTokenStandard({
                                address: tokenAddress,
                                standard: undefined,
                            })
                        )

                        dispatch(
                            MiscAction.fetchTokenStandard({
                                address: tokenAddress,
                                showLoadingToast: true,
                                fingerprint: Flag.isFetchingTokenStandard(tokenAddress),
                            })
                        )
                    }}
                >
                    <Text>{i18n('common.tokenStandardLabel', TokenStandard.Unknown)}</Text>
                </TokenLabel>
            ) : (
                <TokenLabel as="div">
                    <Text>{i18n('common.tokenStandardLabel', tokenStandard)}</Text>
                </TokenLabel>
            )}
        </div>
    )
}
