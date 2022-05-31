import { SVGAttributes, useRef } from 'react'
import tw from 'twin.macro'
import getIdenticon from '../getters/getIdenticon'
import { v4 as uuidv4 } from 'uuid'

export enum AvatarStatus {
    Online = '#00C85D',
    Offline = '#59799C',
}

type Props = SVGAttributes<SVGElement> & {
    account: string
    status?: AvatarStatus
    backgroundColor?: string
}

export default function Avatar({ account, backgroundColor = '#EFF4F9', status, ...props }: Props) {
    const { current: maskId } = useRef(`mask-${uuidv4()}`)

    return (
        <svg
            {...props}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            css={[
                tw`
                    overflow-hidden
                    flex-shrink-0
                    w-10
                    h-10
                `,
            ]}
        >
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
                    href={`data:image/png;base64,${getIdenticon(account)}`}
                    width="40"
                    height="40"
                    x="0"
                    y="0"
                />
            </g>
            {!!status && <circle cx="35" cy="35" r="4" fill={status} />}
        </svg>
    )
}
