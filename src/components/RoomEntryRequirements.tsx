import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import useFlag from '$/hooks/useFlag'
import { EntryRequirements } from '$/hooks/useRoomEntryRequirements'
import useTokenInfo from '$/hooks/useTokenInfo'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

export default function RoomEntryRequirements({ tokenAddress, unit, quantity }: EntryRequirements) {
    const tokenInfo = useTokenInfo(tokenAddress)

    const dispatch = useDispatch()

    const busy = useFlag(Flag.isFetchingKnownTokens())

    useEffect(() => {
        dispatch(MiscAction.fetchKnownTokens())
    }, [dispatch])

    return (
        <div
            css={tw`
                inline-flex
                rounded-[4px]
                px-1
                bg-[#F1F4F5]
                items-center
                leading-normal
            `}
        >
            <div
                css={tw`
                    w-3
                    h-3
                    mr-0.5
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
            <Text>
                {typeof quantity === 'string' && <>{quantity} </>}
                {unit}
            </Text>
        </div>
    )
}
