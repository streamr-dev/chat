import { HTMLAttributes, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import { v4 as uuidv4 } from 'uuid'
import {
    useIdenticon,
    useIsRetrievingIdenticon,
    useRetrieveIdenticon,
} from '$/features/identicons/hooks'
import fallbackIdenticon from '$/utils/fallbackIdenticon'
import Spinner from './Spinner'
import useENSName from '$/hooks/useENSName'
import useAvatar from '$/hooks/useAvatar'
import { stickyRoomIds } from '$/config.json'
import { RoomId } from '$/features/room/types'

const stickyRoomAvatar = stickyRoomIds.reduce<Partial<Record<RoomId, string>>>(
    (memo, { id, ...rest }) => {
        if ('iconSrc' in rest && typeof rest.iconSrc === 'string') {
            memo[id] = rest.iconSrc
        }

        return memo
    },
    {}
)

export enum AvatarStatus {
    Online = '#00C85D',
    Offline = '#59799C',
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    seed: undefined | string
    status?: AvatarStatus
    backgroundColor?: string
}

interface WrapProps extends HTMLAttributes<HTMLDivElement> {
    busy?: boolean
}

export function Wrap({ busy = false, children, ...props }: WrapProps) {
    return (
        <div
            {...props}
            css={[
                tw`
                    w-10
                    h-10
                    relative
                    overflow-hidden
                `,
            ]}
        >
            {busy && <Spinner strokeWidth={1.5} />}
            {children}
        </div>
    )
}

export default function Avatar({ seed, backgroundColor = '#EFF4F9', status, ...props }: Props) {
    const { current: maskId } = useRef(`mask-${uuidv4()}`)

    const identicon = useIdenticon(seed)

    const isRetrievingIdenticon = useIsRetrievingIdenticon(seed)

    const ens = useENSName(seed && /^0x[a-f\d]{40}$/i.test(seed) ? seed : undefined)

    const avatar = useAvatar(ens)

    const busy = !seed || isRetrievingIdenticon || (!!ens && typeof avatar === 'undefined')

    const retrieveIdenticon = useRetrieveIdenticon()

    useEffect(() => {
        if (!identicon && seed) {
            retrieveIdenticon(seed)
        }
    }, [identicon, seed])

    let href = `data:image/png;base64,${fallbackIdenticon}`

    if (!ens || avatar === null) {
        href = `data:image/png;base64,${identicon || fallbackIdenticon}`
    }

    if (typeof avatar === 'string') {
        href = avatar
    }

    const stickyRoomAvatarHref = seed ? stickyRoomAvatar[seed] : undefined

    if (stickyRoomAvatarHref) {
        href = stickyRoomAvatarHref
    }

    return (
        <Wrap {...props} busy={busy}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id={maskId}>
                        {status ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M37.564 29.574A19.911 19.911 0 0 0 40 20C40 8.954 31.046 0 20 0S0 8.954 0 20s8.954 20 20 20c3.468 0 6.73-.883 9.574-2.436a6 6 0 0 1 7.99-7.99z"
                                fill="white"
                            />
                        ) : (
                            <circle r="20" cx="20" cy="20" fill="white" />
                        )}
                    </mask>
                </defs>
                <g mask={`url(#${maskId})`}>
                    <rect width="100%" height="100%" fill={backgroundColor} />
                    <image
                        href={href}
                        width="40"
                        height="40"
                        x="0"
                        y="0"
                        preserveAspectRatio="xMinYMin slice"
                    />
                </g>
                {!!status && <circle cx="35" cy="35" r="4" fill={status} />}
            </svg>
        </Wrap>
    )
}
