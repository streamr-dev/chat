import Spinner from '$/components/Spinner'
import Text from '$/components/Text'
import { RoomId } from '$/features/room/types'
import usePrivacyOption from '$/hooks/usePrivacyOption'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'
import useRoomEntryRequirements from '$/hooks/useRoomEntryRequirements'
import RoomEntryRequirements from '$/components/RoomEntryRequirements'
import { TokenGatedRoomOption } from '$/components/PrivacySelectField'

interface Props extends HTMLAttributes<HTMLDivElement> {
    roomId: RoomId | undefined
    mini?: boolean
}

export default function RoomInfo({ roomId, mini = false, children, ...props }: Props) {
    const privacyOption = usePrivacyOption(roomId)

    const requirements = useRoomEntryRequirements(roomId)

    if (typeof privacyOption === 'undefined' || typeof requirements === 'undefined') {
        return <Pending>{children}</Pending>
    }

    const { icon: PrivacyIcon, label: privacyLabel } = privacyOption || {}

    return (
        <Wrap {...props}>
            {(!mini || privacyOption !== TokenGatedRoomOption) && (
                <>
                    <PrivacyIcon
                        css={tw`
                            w-3
                            mr-1.5
                            ml-0.5
                        `}
                    />
                    <Text>{privacyLabel} room</Text>
                </>
            )}
            {requirements && (
                <>
                    {!mini && <Text css={tw`whitespace-pre-wrap`}> requiring </Text>}
                    <RoomEntryRequirements {...requirements} />
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
            <Text>Loading…</Text>
            {children}
        </Wrap>
    )
}
