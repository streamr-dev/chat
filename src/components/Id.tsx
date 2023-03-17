import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { HTMLAttributes } from 'react';
import tw from 'twin.macro'

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children: string
}

export default function Id({ children, ...props }: Props) {
    const partials = pathnameToRoomIdPartials(children)

    return (
        <span
            {...props}
            css={[
                tw`
                    text-[14px]
                    font-karelia
                    font-medium
                `,
            ]}
        >
            {typeof partials === 'string' ? (
                <>{partials}</>
            ) : (
                <>
                    {partials.account.slice(0, 6)}
                    <Separator>…</Separator>
                    {partials.account.slice(-4)}
                    <Separator>~</Separator>
                    {partials.uuid}
                </>
            )}
        </span>
    )
}

function Separator(props: HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            {...props}
            css={[
                tw`
                    text-[12px]
                    px-[1px]
                `,
            ]}
        />
    )
}
