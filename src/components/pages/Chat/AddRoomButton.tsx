import { ButtonHTMLAttributes } from 'react'

export default function AddRoomButton(
    props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>
) {
    return (
        <button {...props} type="button">
            Add new room
        </button>
    )
}
