import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { MessageAction } from '$/features/message'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useFlag from '$/hooks/useFlag'
import useSubscriber from '$/hooks/useSubscriber'
import { DayInMillis } from '$/utils/getBeginningOfDay'
import i18n from '$/utils/I18n'
import { format } from 'date-fns'
import { HTMLAttributes } from 'react'
import { useDispatch } from 'react-redux'
import tw, { css } from 'twin.macro'

interface Props extends HTMLAttributes<HTMLDivElement> {
    timestamp: number
    includeDate: boolean
    showLoadPreviousDay?: boolean
    empty?: boolean
}

export default function MessageGroupLabel({
    timestamp,
    includeDate,
    showLoadPreviousDay = false,
    empty = false,
    ...props
}: Props) {
    const roomId = useSelectedRoomId()

    const requester = useWalletAccount()

    const streamrClient = useSubscriber(roomId)

    const isLoadingPreviousDay = useFlag(
        roomId && requester
            ? Flag.isResendingMessagesForSpecificDay(roomId, requester, timestamp - DayInMillis)
            : undefined
    )

    const dispatch = useDispatch()

    return (
        <div
            {...props}
            css={[
                tw`
                    text-center
                    text-[0.75rem]
                    font-medium
                    text-[#59799C]
                    my-4
                    opacity-75
                `,
            ]}
        >
            <Text>
                {empty ? (
                    <>{format(timestamp, 'LLL do')}</>
                ) : (
                    <>{format(timestamp, includeDate ? 'LLL do, HH:mm' : 'HH:mm')}</>
                )}
                {showLoadPreviousDay && !isLoadingPreviousDay && (
                    <>
                        {' '}
                        &middot;{' '}
                        <button
                            onClick={() => {
                                if (!roomId || !requester || !streamrClient) {
                                    return
                                }

                                dispatch(
                                    MessageAction.resend({
                                        roomId,
                                        requester,
                                        streamrClient,
                                        timestamp: timestamp - DayInMillis,
                                        fingerprint: Flag.isResendingMessagesForSpecificDay(
                                            roomId,
                                            requester,
                                            timestamp - DayInMillis
                                        ),
                                    })
                                )
                            }}
                            type="button"
                            css={[
                                css`
                                    font: inherit;
                                `,
                                tw`
                                    appearance-none
                                `,
                            ]}
                        >
                            Load previous day
                        </button>
                    </>
                )}
                {isLoadingPreviousDay && <> &middot; {i18n('common.loadingPreviousDay')}</>}
            </Text>
        </div>
    )
}
