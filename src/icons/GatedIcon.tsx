import { SVGAttributes } from 'react'

export default function GatedIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9 17.333A8.333 8.333 0 1 1 9 .667a8.333 8.333 0 0 1 0 16.666zM9 5.464L5.464 9 9 12.536 12.536 9 9 5.464z"
                fill="currentColor"
            />
        </svg>
    )
}
