import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import useFlag from '$/hooks/useFlag'
import { EntryRequirements } from '$/hooks/useRoomEntryRequirements'
import useTokenInfo from '$/hooks/useTokenInfo'
import { HTMLAttributes, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

type Props = EntryRequirements & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export default function RoomEntryRequirements({ tokenAddress, unit, quantity, ...props }: Props) {
    const tokenInfo = useTokenInfo(tokenAddress)

    const dispatch = useDispatch()

    const busy = useFlag(Flag.isFetchingKnownTokens())

    useEffect(() => {
        dispatch(MiscAction.fetchKnownTokens())
    }, [dispatch])

    return (
        <div
            {...props}
            css={tw`
                rounded-[4px]
                font-karelia
                p-1
                bg-[#F1F4F5]
                flex
                items-center
            `}
        >
            <div
                css={tw`
                    w-4
                    h-4
                    mr-1
                `}
            >
                {tokenInfo ? (
                    <img
                        src={`https://polygonscan.com/token/images/${tokenInfo.logo}`}
                        alt={tokenInfo.symbol}
                        width="32"
                        height="32"
                        css={tw`w-full h-full`}
                    />
                ) : (
                    <div
                        css={[
                            tw`
                                rounded-full
                                relative
                                w-full
                                h-full
                                bg-white
                            `,
                            !busy &&
                                tw`
                                    border
                                    border-dashed
                                    border-gray-600
                                `,
                        ]}
                    >
                        {!!busy && <Spinner r={2.5} strokeWidth={1} />}
                    </div>
                )}
            </div>
            <Text css={tw`leading-none`}>
                {typeof quantity === 'string' && <>{quantity} </>}
                {unit}
            </Text>
        </div>
    )
}
