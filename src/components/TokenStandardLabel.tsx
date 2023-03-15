import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import useTokenStandard from '$/hooks/useTokenStandard'
import { OptionalAddress } from '$/types'
import i18n from '$/utils/i18n'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

interface Props {
    tokenAddress: OptionalAddress
}

const commonCss = tw`
    bg-[#59799C]
    ml-6
    px-1
    rounded-sm
    select-none
    text-[10px]
    text-white
`

export default function TokenStandardLabel({ tokenAddress }: Props) {
    const dispatch = useDispatch()

    const tokenStandard = useTokenStandard(tokenAddress)

    if (!tokenAddress || !tokenStandard) {
        return null
    }

    return (
        <>
            {tokenStandard === TokenStandard.Unknown ? (
                <button
                    type="button"
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
                    css={[commonCss, tw`appearance-none`]}
                >
                    <Text>{i18n('common.tokenStandardLabel', TokenStandard.Unknown)}</Text>
                </button>
            ) : (
                <div css={commonCss}>
                    <Text>{i18n('common.tokenStandardLabel', tokenStandard)}</Text>
                </div>
            )}
        </>
    )
}
