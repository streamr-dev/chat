import tw from 'twin.macro'
import { format } from 'date-fns'
import Text from '../Text'
import AddMemberIcon from '../../icons/AddMemberIcon'
import Button from '../Button'
import trunc from '../../utils/trunc'

type Props = {
    onAddMemberClick?: () => void
}

export default function EmptyMessageFeed({ onAddMemberClick }: Props) {
    const roomCreatedAt = Date.now()

    const creator = '0xababaababaababaababaababaababaababaababa'

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
            {roomCreatedAt ? (
                <>
                    <div
                        css={[
                            tw`
                                block
                                tracking-[0.02em]
                                mb-8
                            `,
                        ]}
                    >
                        <span tw="font-medium">{trunc(creator)}</span> created
                        this room on{' '}
                        {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                    </div>
                    <Button
                        onClick={onAddMemberClick}
                        css={[
                            tw`
                                bg-[#FFF2EE]
                                text-[#FF5924]
                                flex
                                h-14
                                px-8
                                rounded-full
                                items-center
                                font-medium
                            `,
                        ]}
                    >
                        <div tw="mr-2">
                            <AddMemberIcon />
                        </div>
                        <div tw="flex-grow">
                            <Text>Add member</Text>
                        </div>
                    </Button>
                </>
            ) : null}
        </div>
    )
}
