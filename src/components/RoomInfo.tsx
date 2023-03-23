import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import { RoomId } from '$/features/room/types'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'
import useRoomEntryRequirements from '$/hooks/useRoomEntryRequirements'
import RoomEntryRequirements from '$/components/RoomEntryRequirements'
import usePrivacy from '$/hooks/usePrivacy'
import i18n from '$/utils/i18n'
import { PrivacySetting } from '$/types'

interface Props extends HTMLAttributes<HTMLDivElement> {
    roomId: RoomId | undefined
    mini?: boolean
}

export default function RoomInfo({ roomId, mini = false, children, ...props }: Props) {
    const privacy = usePrivacy(roomId)

    const requirements = useRoomEntryRequirements(roomId)

    if (typeof privacy === 'undefined' || typeof requirements === 'undefined') {
        return <Pending>{children}</Pending>
    }

    const PrivacyIcon = i18n('common.roomPrivacyIcon', privacy)

    return (
        <Wrap {...props}>
            {(!mini || privacy !== PrivacySetting.TokenGated || requirements === null) && (
                <>
                    <PrivacyIcon
                        css={tw`
                            shrink-0
                            w-3
                            mr-1.5
                            ml-0.5
                        `}
                    />
                    <Text truncate>{i18n('common.roomPrivacyLabel', privacy)} room</Text>
                </>
            )}
            {requirements && (
                <>
                    {!mini && (
                        <Text
                            css={tw`
                                whitespace-pre-wrap
                                hidden
                                lg:block
                            `}
                        >
                            {i18n('common.requiringLabel')}
                        </Text>
                    )}
                    <RoomEntryRequirements
                        {...requirements}
                        css={tw`
                            ml-1
                            lg:ml-0
                        `}
                    />
                </>
            )}
            {children}
        </Wrap>
    )
}

function Wrap(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={tw`
                h-6
                flex
                items-center
                text-[#59799C]
                text-[12px]
                lg:text-[14px]
            `}
        />
    )
}

function Pending({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <Wrap {...props}>
            <div
                css={tw`
                    w-3
                    h-3
                    relative
                    mr-1.5
                    ml-0.5
                `}
            >
                <Spinner r={4} strokeWidth={1.5} />
            </div>
            <Text>{i18n('common.load', true)}</Text>
            {children}
        </Wrap>
    )
}
