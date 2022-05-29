import tw from 'twin.macro'
import { format } from 'date-fns'
import Text from '../Text'
import AddMemberIcon from '../../icons/AddMemberIcon'
import trunc from '../../utils/trunc'
import UtilityButton from '../UtilityButton'
import useSelectedRoom from '../../hooks/useSelectedRoom'

type Props = {
    onAddMemberClick?: () => void
    canModifyMembers?: boolean
}

export default function EmptyMessageFeed({ onAddMemberClick, canModifyMembers = false }: Props) {
    return (
        <div
            css={[
                tw`
                    items-center
                    text-[#59799c]
                    flex
                    flex-col
                    h-full
                    justify-center
                    overflow-hidden
                    pt-4
                `,
            ]}
        >
            <div
                css={[
                    tw`
                            block
                            tracking-[0.02em]
                            mb-8
                            empty:hidden
                        `,
                ]}
            >
                <Credits />
            </div>
            <UtilityButton
                disabled={!canModifyMembers}
                onClick={onAddMemberClick}
                css={[
                    tw`
                        flex
                        items-center
                    `,
                ]}
            >
                <div tw="mr-2">
                    <AddMemberIcon />
                </div>
                <div tw="flex-grow">
                    <Text>Add member</Text>
                </div>
            </UtilityButton>
        </div>
    )
}

function Credits() {
    const { createdAt, createdBy } = useSelectedRoom() || {}

    if (createdAt) {
        return (
            <>
                <span
                    css={[
                        !!createdBy &&
                            tw`
                                font-medium
                            `,
                    ]}
                >
                    {createdBy ? trunc(createdBy) : 'Someone'}
                </span>{' '}
                created this room on {format(createdAt, 'iiii, LLL do yyyy')}.
            </>
        )
    }

    if (createdBy) {
        return (
            <>
                Room created by <span tw="font-medium">{trunc(createdBy)}</span>.
            </>
        )
    }

    return null
}
