import { SVGAttributes } from 'react'
import tw from 'twin.macro'

export default function PinIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            width="9"
            height="12"
            viewBox="0 0 9 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            css={[
                tw`
                    translate-y-[5%]
                `,
            ]}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.167 6.34c0-.273-.199-.495-.467-.57a1.748 1.748 0 0 1-1.283-1.687V1.167H7c.32 0 .583-.263.583-.584A.585.585 0 0 0 7 0H1.167a.585.585 0 0 0-.584.583c0 .321.263.584.584.584h.583v2.916c0 .805-.542 1.482-1.283 1.686-.269.076-.467.298-.467.572v.076C0 6.737.263 7 .583 7h2.905l.012 4.083c0 .321.263.584.583.584a.586.586 0 0 0 .584-.584L4.655 7h2.928a.586.586 0 0 0 .584-.583V6.34z"
                fill="currentColor"
            />
        </svg>
    )
}
