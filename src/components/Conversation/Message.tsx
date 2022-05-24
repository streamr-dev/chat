import { HTMLAttributes } from 'react'
import tw, { css } from 'twin.macro'
import getIdenticon from '../../getters/getIdenticon'
import Text from '../Text'
import DateTooltip from './DateTooltip'

type Props = HTMLAttributes<HTMLDivElement> & {
    sender: string
    createdAt: number
    incoming?: boolean
}

export default function Message({
    sender,
    createdAt,
    children,
    incoming = false,
    ...props
}: Props) {
    return (
        <div
            {...props}
            css={[
                tw`
                    flex
                `,
                !incoming &&
                    tw`
                        justify-end
                    `,
            ]}
        >
            {incoming && <Avatar account={sender} tw="mr-4" />}
            <div
                css={[
                    css`
                        flex: 0 1 auto;

                        :hover :first-child {
                            opacity: 1;
                            visibility: visible;
                            transition-delay: 1s, 1s;
                        }
                    `,
                    tw`
                        bg-[#F1F4F7]
                        rounded-xl
                        text-[0.875rem]
                        leading-7
                        max-w-full
                        min-w-0
                        px-4
                        py-1.5
                        relative
                        break-words
                    `,
                    !incoming &&
                        tw`
                            bg-[#615ef0]
                            text-white
                        `,
                ]}
            >
                <DateTooltip timestamp={createdAt} />
                <Text>{children}</Text>
            </div>
            {!incoming && <Avatar account={sender} tw="ml-4" />}
        </div>
    )
}

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
    account: string
}

function Avatar({ account, ...props }: AvatarProps) {
    return (
        <div
            {...props}
            css={[
                css`
                    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05),
                        0 1px 1px rgba(0, 0, 0, 0.1);
                `,
                tw`
                    rounded-full
                    overflow-hidden
                    flex-shrink-0
                    w-10
                    h-10
                    p-2
                `,
            ]}
        >
            <img
                css={[
                    tw`
                        bg-[#f1f4f7]
                        bg-white
                        block
                        w-full
                        h-full
                    `,
                ]}
                src={`data:image/png;base64,${getIdenticon(account)}`}
                alt={account}
            />
        </div>
    )
}
