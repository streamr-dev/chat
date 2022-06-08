import { SVGAttributes } from 'react'

export default function RemoveUserIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM2 6a6 6 0 1 1 12 0A6 6 0 0 1 2 6zm12 6a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1zm-9.5 4C3.24 16 2 17.213 2 19a1 1 0 1 1-2 0c0-2.632 1.893-5 4.5-5h7c2.607 0 4.5 2.368 4.5 5a1 1 0 1 1-2 0c0-1.787-1.24-3-2.5-3h-7z"
                fill="currentColor"
            />
        </svg>
    )
}
