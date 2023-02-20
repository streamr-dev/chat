import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
import Button from './Button'

export default function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            {...props}
            css={tw`
                text-[white]
                font-medium
                bg-[#FF5924]
                h-[30px]
                px-3
                rounded-full
            `}
        />
    )
}
